"use client";
import { useState } from "react";
import { PortalShell, PageIntro, ActionButton, ActionLink } from "@/components/portal-shell";
import { useDemo, useDemoMeetings } from "@/components/demo-provider";
import { reportStatusPresentation } from "@/data/secretariat-report";
import { deriveAttendanceSummary } from "@/data/secretariat-attendance";
import { StatusTag } from "@/components/portal-patterns";

export default function LeaderReports() {
  const {operations, setOperations} = useDemo();
  const meetings = useDemoMeetings();
  const [selected, setSelected] = useState<string | null>(null);
  const sent = meetings.filter(meeting => operations[meeting.id]?.snapshot && operations[meeting.id].status !== "draft");
  const report = selected ? operations[selected] : undefined;
  const snapshot = report?.snapshot;
  const totals = snapshot ? deriveAttendanceSummary(snapshot.people, snapshot.records) : undefined;
  function open(id: string) {
    setSelected(id);
    setOperations(current => current[id]?.status === "sentToLeader" ? {...current, [id]: {...current[id], status: "viewedByLeader"}} : current);
  }
  return <PortalShell currentPath="/lideranca"><PageIntro title="Relatórios da célula" eyebrow="Liderança da Gênesis" description="Consulte os encontros registrados pela Secretaria para acompanhamento das pessoas." />
    <div className="detail-layout"><p className="notice">Demonstração da consulta do Líder. As alterações duram enquanto você navega nesta sessão; recarregar a página reinicia os dados.</p>
    <ActionLink href="/lideranca" variant="text">Voltar para liderança</ActionLink>
    {!sent.length ? <article className="detail-card"><h2>Nenhum relatório enviado nesta sessão</h2><p>Os relatórios aparecerão aqui depois do envio pela Secretaria.</p></article> : sent.map(meeting => <article className="detail-card" key={meeting.id}><h2>Encontro de {meeting.dateIso.split("-").reverse().join("/")}</h2><StatusTag tone="neutral">{reportStatusPresentation[operations[meeting.id].status].label}</StatusTag><p>{operations[meeting.id].snapshot?.studyTitle}</p><ActionButton variant="secondary" onClick={() => open(meeting.id)}>Visualizar relatório</ActionButton></article>)}
    {snapshot && totals ? <article className="detail-card" aria-live="polite"><h2>Relatório do encontro de {meetings.find(meeting => meeting.id === selected)?.dateIso.split("-").reverse().join("/")}</h2><p>{snapshot.studyTitle}</p><p>{totals.totalPresent} presentes · {totals.absent} ausentes · {totals.visitors.length} visitantes · {totals.unregistered} sem registro</p><h3>Visitantes presentes</h3><p>{totals.visitors.map(person => person.name).join(", ") || "Nenhum visitante registrado"}</p><h3>Como foi o encontro?</h3><p style={{whiteSpace: "pre-wrap"}}>{snapshot.narrative.meetingSummary || "Não informado"}</p><h3>Pedidos de oração e acompanhamentos</h3><p style={{whiteSpace: "pre-wrap"}}>{snapshot.narrative.prayerAndFollowUp || "Não informado"}</p><h3>Observações</h3><p style={{whiteSpace: "pre-wrap"}}>{snapshot.narrative.observations || "Não informado"}</p></article> : null}
    </div></PortalShell>;
}
