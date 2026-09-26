import { RefreshButton } from "./refresh-button";
import { SubmitButton } from "@/app/encontros-compartilhados/submit-button";
import { redirect } from "next/navigation";
import Link from "next/link";
import { database } from "@/lib/supabase/server";
import { sharedAccessConfigured } from "@/lib/supabase/config";
import { signOut } from "../acesso/actions";
import { changeEncounter } from "./actions";
import styles from "./shared.module.css";
export const dynamic = "force-dynamic";
const statusLabels: Record<string,string> = { draft: "Rascunho", sentToLeader: "Enviado ao Líder", viewedByLeader: "Visualizado pelo Líder" };
type AttendanceEntry = { person_id: string; person_name: string; attendance_state: string | null };
export default async function SharedEncounters({ searchParams }: { searchParams: Promise<{ estado?: string }> }) {
  if (!sharedAccessConfigured()) redirect("/acesso");
  const client = await database();
  const { data: { user } } = await client.auth.getUser();
  if (!user) redirect("/acesso");
  const { estado } = await searchParams;
  const encounters = await client.from("portal_encounters").select("id,cell_id,occurs_on,location,announcement,version,attendance_version").order("occurs_on", { ascending: false });
  const assignments = await client.from("portal_assignments").select("cell_id,responsibility");
  const reports = await client.from("portal_reports").select("encounter_id,narrative,status,version,present_count,absent_count,unregistered_count");
  const cells = await client.from("portal_cells").select("id,name");
  const secretaryEncounters = encounters.data?.filter(meeting => assignments.data?.some(a => a.cell_id === meeting.cell_id && a.responsibility === "secretary")) ?? [];
  const rosterResults = await Promise.all(secretaryEncounters.map(async meeting => ({
    encounterId: meeting.id, response: await client.rpc("portal_attendance_roster", { encounter: meeting.id }),
  })));
  const rosters = new Map(rosterResults.map(({ encounterId, response }) => [encounterId, (response.data ?? []) as AttendanceEntry[]]));
  const failed = [encounters,assignments,reports,cells,...rosterResults.map(result => result.response)].some(result => result.error);
  if (failed) {
    console.error("[shared-encounters] data load failed", [encounters, assignments, reports, cells,...rosterResults.map(result => result.response)].map(result => ({
      status: result.status,
      code: result.error?.code,
    })));
  }
  return <main className={styles.page}>
    <header className={styles.header}><div><p className={styles.eyebrow}>Nova Igreja Batista · ambiente de teste</p><h1>Meus encontros</h1><p className={styles.intro}>Acompanhe os encontros das células às quais você está vinculado.</p></div><div className={styles.account}><span>Conta de teste</span><strong>{user.email}</strong><div className={styles.actions}><RefreshButton /><form action={signOut}><SubmitButton>Sair</SubmitButton></form></div></div></header>
    <p className={styles.notice}>As alterações salvas são compartilhadas com as contas autorizadas. Atualize a página para consultar mudanças feitas por outra pessoa.</p>
    {estado === "salvo" && <p role="status">Alteração salva.</p>}
    {estado === "conflito" && <p role="alert">Outra pessoa atualizou este registro. Confira a versão atual antes de editar novamente.</p>}
    {(estado === "erro" || failed) && <p role="alert">Não foi possível concluir a operação. Tente novamente; se persistir, informe o responsável pelo ambiente de teste.</p>}
    {!failed && !encounters.data?.length && <p>Nenhum encontro disponível para sua conta. O responsável pelo teste precisa vincular sua pessoa à célula.</p>}
    {!failed && encounters.data?.map(meeting => {
      const roles = assignments.data?.filter(a => a.cell_id === meeting.cell_id).map(a => a.responsibility) ?? [];
      const secretary = roles.includes("secretary");
      const leader = roles.includes("leader");
      const report = reports.data?.find(r => r.encounter_id === meeting.id);
      const cell = cells.data?.find(c => c.id === meeting.cell_id);
      return <section key={meeting.id} className={styles.card} aria-labelledby={`meeting-${meeting.id}`}>
        <div className={styles.meetingHeading}><div><p className={styles.eyebrow}>Encontro da célula</p><h2 id={`meeting-${meeting.id}`}>{cell?.name} · {meeting.occurs_on.split("-").reverse().join("/")}</h2></div>{secretary || leader ? <span className={styles.role}>{secretary ? "Secretaria" : "Líder"}</span> : null}</div>
        <div className={styles.meetingInfo}><p><strong>Local</strong><span>{meeting.location || "A informar"}</span></p><p><strong>Comunicado</strong><span className={styles.text}>{meeting.announcement || "Nenhum comunicado publicado."}</span></p></div>
        {secretary && <details className={styles.detail}><summary>Editar local e comunicado</summary><form action={changeEncounter} className={styles.form} key={`meeting-${meeting.version}`}>
          <input type="hidden" name="encounter" value={meeting.id}/><input type="hidden" name="version" value={meeting.version}/>
          <label>Local do encontro<input name="location" defaultValue={meeting.location} maxLength={300}/></label>
          <label>Comunicado para a célula<textarea name="announcement" defaultValue={meeting.announcement} maxLength={2000}/></label>
          <p>Estas informações ficam visíveis aos participantes da célula. Use o relatório para registros internos.</p>
          <SubmitButton name="operation" value="encounter">Salvar informações do encontro</SubmitButton>
        </form></details>}
        {secretary && <details className={styles.detail} open={!report || report.status === "draft"}>
          <summary>Registrar presença</summary><div className={styles.attendance}>
          <h3>Presença da célula</h3>
          <p>Registre cada pessoa vinculada à célula. Sem registro não significa ausência. A lista fica reservada à Secretaria; o Líder receberá apenas os totais no relatório.</p>
          {!rosters.get(meeting.id)?.length && <p>Nenhuma pessoa vinculada a esta célula.</p>}
          {rosters.get(meeting.id)?.map(person => <form action={changeEncounter} className={styles.attendanceRow} key={`${meeting.id}-${person.person_id}-${meeting.attendance_version}`}>
            <input type="hidden" name="encounter" value={meeting.id}/>
            <input type="hidden" name="person" value={person.person_id}/>
            <input type="hidden" name="version" value={meeting.attendance_version}/>
            <label>{person.person_name}
              <select name="attendance_state" defaultValue={person.attendance_state ?? "unregistered"} disabled={Boolean(report && report.status !== "draft")}>
                <option value="unregistered">Não registrado</option>
                <option value="present">Presente</option>
                <option value="absent">Ausente</option>
              </select>
            </label>
            {(!report || report.status === "draft") && <SubmitButton name="operation" value="attendance">Salvar presença</SubmitButton>}
          </form>)}
          {report && report.status !== "draft" && <p>Presenças encerradas com o envio do relatório.</p>}
        </div></details>}
        {(secretary || (leader && report)) && <div className={styles.report}><div className={styles.reportHeading}><h3>Relatório reservado</h3><span className={styles.role}>{statusLabels[report?.status ?? "draft"]}</span></div>
          {report?.status !== "draft" && report?.present_count != null && <p>Presença no envio: {report.present_count} presente(s), {report.absent_count} ausente(s), {report.unregistered_count} sem registro.</p>}
          {report?.status !== "draft" && report?.present_count == null && report && <p>Relatório anterior ao registro de presença: totais indisponíveis.</p>}
          {secretary && (!report || report.status === "draft") ? <form action={changeEncounter} className={styles.form} key={`report-${report?.version ?? 0}`}>
            <input type="hidden" name="encounter" value={meeting.id}/><input type="hidden" name="version" value={report?.version ?? 0}/>
            <label>Registro do encontro<textarea name="narrative" defaultValue={report?.narrative ?? ""} maxLength={10000}/></label>
            <p>O Líder responsável poderá consultar após o envio. O conteúdo enviado não poderá ser editado nesta etapa.</p>
            <div className={styles.actions}><SubmitButton name="operation" value="draft">Salvar rascunho</SubmitButton><SubmitButton name="operation" value="send">Enviar ao Líder</SubmitButton></div>
          </form> : <p className={styles.text}>{report?.narrative}</p>}
          {leader && report?.status === "sentToLeader" && <form action={changeEncounter}>
            <input type="hidden" name="encounter" value={meeting.id}/><input type="hidden" name="version" value={report.version}/>
            <SubmitButton name="operation" value="view">Registrar minha leitura</SubmitButton>
          </form>}
        </div>}
      </section>;
    })}
    <Link className={styles.backLink} href="/">Voltar à demonstração</Link>
  </main>;
}
