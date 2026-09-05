"use client";

import { useSyncExternalStore } from "react";
import { type PersonalServiceAssignment } from "@/data/cell";
import { getTemporalContext, parseLocalDate } from "@/data/temporal-context";
import styles from "../minha-celula.module.css";

const subscribeToBrowser = () => () => undefined;

export function PersonalScheduleList({ assignments }: { assignments: readonly PersonalServiceAssignment[] }) {
  const browserIsReady = useSyncExternalStore(subscribeToBrowser, () => true, () => false);
  const today = browserIsReady ? new Date() : null;
  const [nextAssignment, ...laterAssignments] = assignments;

  if (!nextAssignment) return null;

  const nextStudy = "study" in nextAssignment.meeting ? nextAssignment.meeting.study : null;

  return (
    <div className={styles.scheduleGroups}>
      <div className={styles.nextScheduleGroup} role="group" aria-label="Próxima escala">
        <TemporalContext dateIso={nextAssignment.meeting.dateIso} today={today} />
        <ScheduleEntry assignment={nextAssignment} />
        {nextStudy ? (
          <div className={styles.nextScheduleContext}>
            <strong>{nextStudy.title}</strong>
            <span>{nextStudy.lessonNumber} · {nextStudy.bibleReference}</span>
          </div>
        ) : null}
      </div>

      {laterAssignments.length > 0 ? (
        <div className={styles.laterSchedules} role="group" aria-label="Encontros futuros">
          <span className={styles.scheduleFollowingLabel}>Encontros futuros</span>
          <ol className={styles.scheduleList}>
            {laterAssignments.map((assignment) => (
              <li key={`${assignment.meetingId}-${assignment.serviceFunction}`}>
                <ScheduleEntry assignment={assignment} />
              </li>
            ))}
          </ol>
        </div>
      ) : null}
    </div>
  );
}

function ScheduleEntry({ assignment }: { assignment: PersonalServiceAssignment }) {
  return (
    <div className={styles.scheduleEntry}>
      <time className={styles.scheduleDate} dateTime={assignment.meeting.dateIso}>
        <strong>{formatDatePart(assignment.meeting.dateIso, "day")}</strong>
        <span>{formatDatePart(assignment.meeting.dateIso, "month")}</span>
      </time>
      <div className={styles.scheduleContent}>
        <strong>{assignment.serviceFunction}</strong>
        <span>{formatWeekday(assignment.meeting.dateIso)} · {assignment.meeting.startTime}</span>
      </div>
    </div>
  );
}

function TemporalContext({ dateIso, today }: { dateIso: string; today: Date | null }) {
  const label = getTemporalContext(dateIso, today);
  return label ? <span className={styles.scheduleProximity}>{label}</span> : null;
}

function formatDatePart(dateIso: string, part: "day" | "month") {
  const options: Intl.DateTimeFormatOptions = part === "day" ? { day: "2-digit" } : { month: "short" };
  return new Intl.DateTimeFormat("pt-BR", options).format(parseLocalDate(dateIso)).replace(".", "").toUpperCase();
}

function formatWeekday(dateIso: string) {
  const weekday = new Intl.DateTimeFormat("pt-BR", { weekday: "long" }).format(parseLocalDate(dateIso));
  return weekday.charAt(0).toUpperCase() + weekday.slice(1);
}
