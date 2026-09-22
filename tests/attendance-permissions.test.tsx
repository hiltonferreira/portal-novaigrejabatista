// @vitest-environment node
import { afterAll, beforeAll, expect, test } from "vitest";
import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";

const db = new PGlite();
const id = (n: number) => `00000000-0000-0000-0000-${String(n).padStart(12,"0")}`;
async function asUser(n: number) {
  await db.exec("reset role");
  await db.query("select set_config('request.jwt.claim.sub',$1,false)", [id(n)]);
  await db.exec("set role authenticated");
}

beforeAll(async () => {
  await db.exec(`create role anon; create role authenticated; create schema auth;
    create table auth.users(id uuid primary key);
    create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
    grant usage on schema auth to authenticated; grant execute on function auth.uid() to authenticated;`);
  await db.exec(readFileSync("supabase/migrations/202609220001_shared_encounters.sql", "utf8"));
  await db.exec(readFileSync("supabase/migrations/202609220002_attendance.sql", "utf8"));
  for (let n=1;n<=5;n++) {
    await db.query("insert into auth.users values ($1)", [id(n)]);
    await db.query("insert into portal_people values ($1,$2)",[id(n),`Pessoa ${n}`]);
    await db.query("insert into portal_accounts values ($1,$1)",[id(n)]);
  }
  await db.query("insert into portal_cells values ($1,'Célula A'),($2,'Célula B')",[id(10),id(11)]);
  for (const [person,cell,role] of [[1,10,'secretary'],[1,10,'member'],[2,10,'member'],[3,10,'leader'],[4,11,'secretary']] as const)
    await db.query("insert into portal_assignments values ($1,$2,$3)",[id(person),id(cell),role]);
  await db.query("insert into portal_encounters(id,cell_id,occurs_on) values ($1,$2,'2026-09-22'),($3,$4,'2026-09-22')",[id(20),id(10),id(21),id(11)]);
},30000);
afterAll(() => db.close());

test("Secretaria registra presença; relatório congela totais; demais perfis não acessam nomes", async () => {
  await asUser(2);
  await expect(db.query("select * from portal_attendance")).rejects.toThrow();
  await expect(db.query("select * from portal_attendance_roster($1)",[id(20)])).rejects.toThrow("Forbidden");
  await expect(db.query("select portal_save_attendance($1,$2,0,'present')",[id(20),id(2)])).rejects.toThrow("Forbidden");
  await asUser(3);
  await expect(db.query("select * from portal_attendance_roster($1)",[id(20)])).rejects.toThrow("Forbidden");
  await asUser(4);
  await expect(db.query("select * from portal_attendance_roster($1)",[id(20)])).rejects.toThrow("Forbidden");
  await asUser(1);
  const initial = await db.query<{person_id:string;attendance_state:string|null}>("select person_id,attendance_state from portal_attendance_roster($1)",[id(20)]);
  expect(initial.rows).toHaveLength(3); // A pessoa 1 tem duas responsabilidades, mas uma presença.
  expect(initial.rows.every(person => person.attendance_state === null)).toBe(true);
  await expect(db.query("select portal_save_attendance($1,$2,0,'present')",[id(20),id(4)])).rejects.toThrow("Person is not assigned");
  await expect(db.query("select portal_save_attendance($1,$2,0,'absent')",[id(20),id(5)])).rejects.toThrow("Person is not assigned");
  await expect(db.query("select portal_save_attendance($1,$2,0,'unknown')",[id(20),id(2)])).rejects.toThrow("Invalid attendance");
  await db.query("select portal_save_attendance($1,$2,0,'present')",[id(20),id(1)]);
  await expect(db.query("select portal_save_attendance($1,$2,0,'absent')",[id(20),id(2)])).rejects.toThrow("Conflict");
  await db.query("select portal_save_attendance($1,$2,1,'present')",[id(20),id(2)]);
  await db.query("select portal_save_attendance($1,$2,2,null)",[id(20),id(2)]);
  await db.query("select portal_save_attendance($1,$2,3,'absent')",[id(20),id(3)]);
  await db.query("select portal_save_report($1,0,'Relato do encontro',true)",[id(20)]);
  await expect(db.query("select portal_save_attendance($1,$2,4,'absent')",[id(20),id(2)])).rejects.toThrow("Report already sent");
  await asUser(3);
  const summary = await db.query<{present_count:number;absent_count:number;unregistered_count:number}>(
    "select present_count,absent_count,unregistered_count from portal_reports where encounter_id=$1",[id(20)]);
  expect(summary.rows).toEqual([{present_count:1,absent_count:1,unregistered_count:1}]);
  await db.exec("reset role");
  await db.query("insert into portal_assignments values ($1,$2,'member')",[id(5),id(10)]);
  await asUser(3);
  expect((await db.query("select present_count,absent_count,unregistered_count from portal_reports where encounter_id=$1",[id(20)])).rows)
    .toEqual(summary.rows);
  await asUser(2);
  expect((await db.query("select * from portal_reports")).rows).toHaveLength(0);
  await db.exec("reset role; set role anon");
  await expect(db.query("select * from portal_attendance_roster($1)",[id(20)])).rejects.toThrow();
});
