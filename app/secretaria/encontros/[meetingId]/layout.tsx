import Link from "next/link";
import { notFound } from "next/navigation";
import { getSecretariatMeetingById } from "@/data/secretariat-meetings";
import { MeetingTabs } from "./_components/meeting-tabs";
import styles from "../../secretaria.module.css";

function formatLongDate(dateIso: string) {
  const [year, month, day] = dateIso.split("-").map(Number);
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", timeZone: "UTC" })
    .format(new Date(Date.UTC(year, month - 1, day)));
}

function formatShortDate(dateIso: string) {
  const [, month, day] = dateIso.split("-");
  return `${day}/${month}`;
}

function formatWeekday(dateIso: string) {
  const [year, month, day] = dateIso.split("-").map(Number);
  return new Intl.DateTimeFormat("pt-BR", { weekday: "long" }).format(new Date(year, month - 1, day)).replace(/^./, (letter) => letter.toLocaleUpperCase("pt-BR"));
}

export default async function SecretariatMeetingLayout({ children, params }: {
  children: React.ReactNode;
  params: Promise<{ meetingId: string }>;
}) {
  const { meetingId } = await params;
  if (meetingId === "novo") return children;

  const meeting = getSecretariatMeetingById(meetingId);
  if (!meeting) notFound();
  const study = "study" in meeting ? meeting.study : undefined;

  return (
    <div className={styles.meetingDetailShell}>
      <Link className={styles.backLink} href="/secretaria/encontros" aria-label="Voltar para encontros">‹ Voltar para encontros</Link>
      <header className={styles.meetingDetailHeader}>
        <p>Encontro de {formatLongDate(meeting.dateIso)}</p>
        <h2>{meeting.title}</h2>
        {study ? <span>{study.lessonNumber} · {study.bibleReference}</span> : null}
        <time dateTime={`${meeting.dateIso}T${meeting.startTime.replace("h", ":")}`}>{formatWeekday(meeting.dateIso)} · {formatShortDate(meeting.dateIso)} · {meeting.startTime}</time>
      </header>
      <MeetingTabs meetingId={meetingId} />
      {children}
    </div>
  );
}
