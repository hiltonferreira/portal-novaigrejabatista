"use client";
import { useMeeting } from "@/components/demo-provider";
import Link from "next/link";
import { ActionLink } from "@/components/portal-shell";
import { ContextTag, SectionLabel, StatusTag } from "@/components/portal-patterns";
import { formatShortDate } from "@/data/cell";
import { secretariatOverviewMock as overview } from "@/data/secretariat";
import { MeetingTemporalTag } from "./_components/meeting-temporal-tag";
import styles from "./secretaria.module.css";

export default function SecretariatOverviewPage() {
  const meeting = useMeeting(overview.nextMeeting.id)!;

  return (
    <div className={styles.overview}>
      <div className={styles.primaryGrid}>
        <section className={styles.contextSection} aria-labelledby="next-action-label">
          <SectionLabel id="next-action-label">Próxima ação</SectionLabel>
          <article className={`${styles.card} ${styles.nextActionCard}`}>
            <ContextTag>{overview.nextAction.context}</ContextTag>
            <h2>{overview.nextAction.title}</h2>
            <p>{overview.nextAction.description}</p>
            <ActionLink href={overview.nextAction.href} variant="primary">Preparar comunicação</ActionLink>
          </article>
        </section>

        <section className={styles.contextSection} aria-labelledby="next-meeting-label">
          <SectionLabel id="next-meeting-label">Próximo encontro</SectionLabel>
          <article className={`${styles.card} ${styles.meetingCard}`}>
            <MeetingTemporalTag dateIso={meeting.dateIso} />
            <h2>{meeting.title}</h2>
            {meeting.study ? <p className={styles.studyMeta}>{meeting.study.lessonNumber} · {meeting.study.bibleReference}</p> : null}
            <p className={styles.meetingTime}>Terça-feira · {formatShortDate(meeting.dateIso)} · {meeting.startTime}</p>
            <dl className={styles.statusList}>
              {Object.entries(meeting.statuses).map(([key, status]) => status ? (
                <div key={key}>
                  <dt>{{communication: "Comunicação", attendance: "Presença", report: "Relatório"}[key]}</dt>
                  <dd><StatusTag tone={status.tone}>{status.label}</StatusTag></dd>
                </div>
              ) : null)}
            </dl>
            <div className={styles.allMeetingsLink}>
              <ActionLink href="/secretaria/encontros" variant="secondary">Ver todos os encontros</ActionLink>
            </div>
          </article>
        </section>
      </div>

      <section className={styles.organizationSection} aria-labelledby="organization-label">
        <SectionLabel id="organization-label">Organização da célula</SectionLabel>
        <article className={`${styles.card} ${styles.organizationCard}`}>
          <ContextTag>Escalas e informações</ContextTag>
          <ul>
            {overview.organization.map((item) => (
              <li key={item.title}>
                <Link href={item.href} aria-label={`${item.title}: ${item.description}`}>
                  <span><strong>{item.title}</strong><small>{item.description}</small></span>
                  <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m7.5 4.5 5 5.5-5 5.5" /></svg>
                </Link>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  );
}
