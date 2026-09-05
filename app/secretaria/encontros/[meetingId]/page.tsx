import { notFound } from "next/navigation";
import { ActionLink } from "@/components/portal-shell";
import { ContextTag, SectionLabel, StatusTag } from "@/components/portal-patterns";
import { getSecretariatMeetingById, secretariatMeetingOverviewMock as overview } from "@/data/secretariat-meetings";
import styles from "../../secretaria.module.css";

export default async function SecretariatMeetingPage({ params }: { params: Promise<{ meetingId: string }> }) {
  const { meetingId } = await params;
  const isNewMeeting = meetingId === "novo";

  if (isNewMeeting) {
    return (
      <section className={styles.placeholder} aria-labelledby="meeting-placeholder-title">
        <SectionLabel id="meeting-placeholder-title">Novo encontro</SectionLabel>
        <p>A criação de encontros será detalhada em uma próxima etapa.</p>
        <ActionLink href="/secretaria/encontros" variant="text">Voltar para encontros</ActionLink>
      </section>
    );
  }

  const meeting = getSecretariatMeetingById(meetingId);
  if (!meeting) notFound();
  const meetingOverview = meeting.id === overview.encounterId ? overview : {
    communication: { status: meeting.statuses.communication ?? { label: "A preparar", tone: "action" as const }, description: overview.communication.description },
    attendance: { status: meeting.statuses.attendance, description: overview.attendance.description },
    report: { status: meeting.statuses.report, description: overview.report.description },
  };
  const study = "study" in meeting ? meeting.study : undefined;

  return (
    <div className={styles.meetingDetailOverview}>
      <section aria-labelledby="preparation-label">
        <SectionLabel id="preparation-label">Preparação do encontro</SectionLabel>
        <article className={`${styles.card} ${styles.preparationCard}`}>
          <ContextTag>Antes do encontro</ContextTag>
          <div className={styles.communicationBlock}>
            <div className={styles.operationHeading}>
              <h3>Comunicação</h3>
              <StatusTag tone={meetingOverview.communication.status.tone}>{meetingOverview.communication.status.label}</StatusTag>
            </div>
            <p>{meetingOverview.communication.description}</p>
            <ActionLink href={`/secretaria/encontros/${meetingId}/comunicacao`} variant="primary">Preparar comunicação</ActionLink>
          </div>
          <dl className={styles.preparationContext}>
            <div>
              <dt>Estudo</dt>
              <dd><strong>{meeting.title}</strong>{study ? <span>{study.lessonNumber} · {study.bibleReference}</span> : null}</dd>
            </div>
            <div>
              <dt>Lanche</dt>
              <dd><ActionLink href="/secretaria/lanche" variant="text">Ver organização do lanche</ActionLink></dd>
            </div>
            <div>
              <dt>Escala</dt>
              <dd><ActionLink href="/minha-celula/escalas" variant="text">Ver escala do encontro</ActionLink></dd>
            </div>
          </dl>
        </article>
      </section>

      <section aria-labelledby="registration-label">
        <SectionLabel id="registration-label">Registro do encontro</SectionLabel>
        <article className={`${styles.card} ${styles.registrationCard}`}>
          <ContextTag>Após o encontro</ContextTag>
          <div className={styles.registrationGrid}>
            <OperationBlock
              title="Presença"
              status={meetingOverview.attendance.status}
              description={meetingOverview.attendance.description}
              action="Registrar presença"
              href={`/secretaria/encontros/${meetingId}/presenca`}
            />
            <OperationBlock
              title="Relatório"
              status={meetingOverview.report.status}
              description={meetingOverview.report.description}
              action="Preencher relatório"
              href={`/secretaria/encontros/${meetingId}/relatorio`}
            />
          </div>
        </article>
      </section>
    </div>
  );
}

function OperationBlock({ title, status, description, action, href }: {
  title: string;
  status: { label: string; tone: "neutral" | "action" | "progress" | "success" };
  description: string;
  action: string;
  href: string;
}) {
  return (
    <div className={styles.operationBlock}>
      <div className={styles.operationHeading}><h3>{title}</h3><StatusTag tone={status.tone}>{status.label}</StatusTag></div>
      <p>{description}</p>
      <ActionLink href={href} variant="secondary">{action}</ActionLink>
    </div>
  );
}
