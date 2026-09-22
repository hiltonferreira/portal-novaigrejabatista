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
  for (let n=1;n<=5;n++) {
    await db.query("insert into auth.users values ($1)", [id(n)]);
    await db.query("insert into portal_people values ($1,$2)",[id(n),`Pessoa teste ${n}`]);
    await db.query("insert into portal_accounts values ($1,$1)",[id(n)]);
  }
  await db.query("insert into portal_cells values ($1,'Célula A'),($2,'Célula B')",[id(10),id(11)]);
  for (const [person,cell,role] of [[1,10,'secretary'],[2,10,'member'],[3,10,'leader'],[4,11,'leader']] as const)
    await db.query("insert into portal_assignments values ($1,$2,$3)",[id(person),id(cell),role]);
  await db.query("insert into portal_encounters(id,cell_id,occurs_on) values ($1,$2,'2026-09-22'),($3,$4,'2026-09-22')",[id(20),id(10),id(21),id(11)]);
},30000);
afterAll(() => db.close());

test("informações compartilhadas, relatório privado e transições autorizadas no banco", async () => {
  await asUser(1);
  await db.query("select portal_update_encounter($1,0,'Local atualizado','Comunicado compartilhado')",[id(20)]);
  await db.query("select portal_save_report($1,0,'Narrativa reservada',false)",[id(20)]);
  await asUser(2);
  expect((await db.query<{announcement:string}>("select announcement from portal_encounters")).rows).toEqual([{announcement:'Comunicado compartilhado'}]);
  expect((await db.query("select * from portal_reports")).rows).toHaveLength(0);
  await expect(db.query("select portal_update_encounter($1,1,'Intrusão','')",[id(20)])).rejects.toThrow('Forbidden');
  await expect(db.exec("update portal_encounters set location='Intrusão' ")).rejects.toThrow();
  await expect(db.query("insert into portal_assignments values ($1,$2,'secretary')",[id(2),id(10)])).rejects.toThrow();
  await asUser(3);
  expect((await db.query("select * from portal_reports")).rows).toHaveLength(0);
  await asUser(1);
  await expect(db.query("select portal_save_report($1,0,'Desatualizado',true)",[id(20)])).rejects.toThrow('Conflict');
  await expect(db.query("select portal_update_encounter($1,null,'Desatualizado','')",[id(20)])).rejects.toThrow('Conflict');
  await db.query("select portal_save_report($1,1,'Conteúdo enviado',true)",[id(20)]);
  await expect(db.query("select portal_save_report($1,2,'Alterado',false)",[id(20)])).rejects.toThrow('Report already sent');
  await expect(db.query("select portal_view_report($1)",[id(20)])).rejects.toThrow('Forbidden');
  await asUser(2);
  expect((await db.query("select * from portal_reports")).rows).toHaveLength(0);
  await asUser(4);
  expect((await db.query("select * from portal_reports")).rows).toHaveLength(0);
  await expect(db.query("select portal_view_report($1)",[id(20)])).rejects.toThrow('Forbidden');
  await asUser(5); // Sem atribuição: não herda acesso pastoral ou técnico.
  expect((await db.query("select * from portal_encounters")).rows).toHaveLength(0);
  await asUser(3);
  expect((await db.query<{narrative:string}>("select narrative from portal_reports")).rows[0].narrative).toBe('Conteúdo enviado');
  await db.query("select portal_view_report($1)",[id(20)]);
  await asUser(1);
  expect((await db.query<{status:string}>("select status from portal_reports")).rows[0].status).toBe('viewedByLeader');
  await db.exec("reset role; set role anon");
  await expect(db.query("select portal_view_report($1)",[id(20)])).rejects.toThrow();
  await expect(db.exec("select * from portal_reports")).rejects.toThrow();
  await db.exec("reset role");
  expect((await db.query("select * from portal_audit")).rows).toHaveLength(4);
});
