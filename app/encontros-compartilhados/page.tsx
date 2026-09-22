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
export default async function SharedEncounters({ searchParams }: { searchParams: Promise<{ estado?: string }> }) {
  if (!sharedAccessConfigured()) redirect("/acesso");
  const client = await database();
  const { data: { user } } = await client.auth.getUser();
  if (!user) redirect("/acesso");
  const { estado } = await searchParams;
  const encounters = await client.from("portal_encounters").select("id,cell_id,occurs_on,location,announcement,version").order("occurs_on", { ascending: false });
  const assignments = await client.from("portal_assignments").select("cell_id,responsibility");
  const reports = await client.from("portal_reports").select("encounter_id,narrative,status,version");
  const cells = await client.from("portal_cells").select("id,name");
  const failed = [encounters,assignments,reports,cells].some(result => result.error);
  if (failed) {
    console.error("[shared-encounters] data load failed", [encounters, assignments, reports, cells].map(result => ({
      status: result.status,
      code: result.error?.code,
    })));
  }
  return <main className={styles.page}>
    <p>Nova Igreja Batista · ambiente de teste</p><h1>Meus encontros</h1><p>Conta: {user.email}</p>
    <div className={styles.actions}><RefreshButton /><form action={signOut}><SubmitButton>Sair</SubmitButton></form></div>
    <p>As alterações salvas são compartilhadas com as contas autorizadas. Atualize a página para consultar mudanças feitas por outra pessoa.</p>
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
      return <section key={meeting.id} className={styles.card}>
        <h2>{cell?.name} · {meeting.occurs_on.split("-").reverse().join("/")}</h2>
        <p><strong>Local:</strong> {meeting.location || "A informar"}</p><p className={styles.text}>{meeting.announcement || "Nenhum comunicado publicado."}</p>
        {secretary && <form action={changeEncounter} className={styles.form} key={`meeting-${meeting.version}`}>
          <input type="hidden" name="encounter" value={meeting.id}/><input type="hidden" name="version" value={meeting.version}/>
          <label>Local do encontro<input name="location" defaultValue={meeting.location} maxLength={300}/></label>
          <label>Comunicado para a célula<textarea name="announcement" defaultValue={meeting.announcement} maxLength={2000}/></label>
          <p>Estas informações ficam visíveis aos participantes da célula. Use o relatório para registros internos.</p>
          <SubmitButton name="operation" value="encounter">Salvar informações do encontro</SubmitButton>
        </form>}
        {(secretary || (leader && report)) && <><h3>Relatório reservado</h3><p>{statusLabels[report?.status ?? "draft"]}</p>
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
        </>}
      </section>;
    })}
    <Link href="/">Voltar à demonstração</Link>
  </main>;
}
