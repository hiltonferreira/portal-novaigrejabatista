"use client";

import { use } from "react";
import { useMeeting } from "@/components/demo-provider";
import { notFound } from "next/navigation";
import { ActionLink } from "@/components/portal-shell";
import { SectionLabel, StatusTag } from "@/components/portal-patterns";
import styles from "../../secretaria.module.css";

const tasks = [
  { key: "communication", title: "Preparar comunicação", href: "comunicacao", description: "Organize as informações para a célula." },
  { key: "attendance", title: "Registrar presença", href: "presenca", description: "Registre participantes e visitantes deste encontro." },
  { key: "report", title: "Preencher relatório", href: "relatorio", description: "Registre as informações para acompanhamento do Líder." },
] as const;

export default function SecretariatMeetingPage({ params }: { params: Promise<{ meetingId: string }> }) {
  const { meetingId } = use(params);
  const meeting = useMeeting(meetingId);
  if (!meeting) notFound();

  const current = tasks.find(task => {
    const status = meeting.statuses[task.key];
    return status?.tone === "action" || status?.tone === "progress";
  });

  return <div className={styles.meetingFocus}>
    <section aria-labelledby="meeting-focus-title">
      <SectionLabel id="meeting-focus-title">Em destaque neste encontro</SectionLabel>
      <article className={`${styles.card} ${styles.meetingFocusCard}`}>
        {current ? <>
          <h3>{current.title}</h3>
          <p>{current.description}</p>
          <ActionLink href={`/secretaria/encontros/${meetingId}/${current.href}`}>Continuar</ActionLink>
        </> : <>
          <h3>Consulte os registros deste encontro</h3>
          <p>As seções acima reúnem comunicação, presença e relatório.</p>
        </>}
      </article>
    </section>
    <section aria-labelledby="meeting-steps-title" className={styles.meetingSteps}>
      <SectionLabel id="meeting-steps-title">Etapas do encontro</SectionLabel>
      <ul>{tasks.map(task => {
        const status = meeting.statuses[task.key];
        return <li key={task.key}>
          <span>{task.title}</span>
          {status ? <StatusTag tone={status.tone}>{status.label}</StatusTag> : null}
        </li>;
      })}</ul>
    </section>
    <nav className={styles.meetingRelated} aria-label="Outras informações do encontro">
      <ActionLink href="/secretaria/lanche" variant="text">Organização do lanche</ActionLink>
      <ActionLink href="/minha-celula/escalas" variant="text">Escala de serviço</ActionLink>
    </nav>
  </div>;
}
