import Link from "next/link";
import { ContextTag, SectionLabel, StatusTag } from "@/components/portal-patterns";
import { ActionLink } from "@/components/portal-shell";
import { secretariatMeetingsMock } from "@/data/secretariat-meetings";
import styles from "../secretaria.module.css";

export default function SecretariatMeetingsPage() {
  return (
    <div className={styles.meetingsOverview}>
      <section aria-labelledby="upcoming-meetings-label">
        <div className={styles.sectionHeadingRow}>
          <SectionLabel id="upcoming-meetings-label">Próximos encontros</SectionLabel>
          <ActionLink href="/secretaria/encontros/novo" variant="primary">+ Novo encontro</ActionLink>
        </div>
        <article className={`${styles.card} ${styles.meetingsCard}`}>
          <ContextTag>Planejamento</ContextTag>
          <ul className={styles.meetingList}>
            {secretariatMeetingsMock.upcoming.map((meeting) => (
              <li key={meeting.id}>
                <MeetingLink meeting={meeting} showCommunication />
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section aria-labelledby="previous-meetings-label">
        <SectionLabel id="previous-meetings-label">Encontros anteriores</SectionLabel>
        <article className={`${styles.card} ${styles.meetingsCard} ${styles.historyCard}`}>
          <ContextTag>Histórico</ContextTag>
          <ul className={styles.meetingList}>
            {secretariatMeetingsMock.previous.map((meeting) => (
              <li key={meeting.id}>
                <MeetingLink meeting={meeting} />
              </li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  );
}

function MeetingLink({ meeting, showCommunication = false }: {
  meeting: (typeof secretariatMeetingsMock.upcoming)[number] | (typeof secretariatMeetingsMock.previous)[number];
  showCommunication?: boolean;
}) {
  const [year, month, day] = meeting.dateIso.split("-").map(Number);
  const monthLabel = new Intl.DateTimeFormat("pt-BR", { month: "short", timeZone: "UTC" })
    .format(new Date(Date.UTC(year, month - 1, day)))
    .replace(".", "")
    .toUpperCase();
  const study = "study" in meeting ? meeting.study : undefined;
  const communication = "communication" in meeting.statuses ? meeting.statuses.communication : undefined;

  return (
    <Link className={styles.meetingRow} href={`/secretaria/encontros/${meeting.id}`} aria-label={`${day} de ${monthLabel}: ${meeting.title}`}>
      <time className={styles.meetingDate} dateTime={meeting.dateIso}>
        <strong>{day.toString().padStart(2, "0")}</strong>
        <span>{monthLabel}</span>
      </time>
      <div className={styles.meetingIdentity}>
        <strong className={"studyPending" in meeting && meeting.studyPending ? styles.undefinedStudy : undefined}>{meeting.title}</strong>
        <span>Terça-feira · {meeting.startTime}</span>
        {study ? <small>{study.lessonNumber} · {study.bibleReference}</small> : null}
      </div>
      <dl className={styles.meetingStatuses}>
        {showCommunication && communication ? (
          <div><dt>Comunicação</dt><dd><StatusTag tone={communication.tone}>{communication.label}</StatusTag></dd></div>
        ) : null}
        <div><dt>Presença</dt><dd><StatusTag tone={meeting.statuses.attendance.tone}>{meeting.statuses.attendance.label}</StatusTag></dd></div>
        <div><dt>Relatório</dt><dd><StatusTag tone={meeting.statuses.report.tone}>{meeting.statuses.report.label}</StatusTag></dd></div>
      </dl>
      <svg className={styles.meetingChevron} viewBox="0 0 20 20" aria-hidden="true"><path d="m7.5 4.5 5 5.5-5 5.5" /></svg>
    </Link>
  );
}
