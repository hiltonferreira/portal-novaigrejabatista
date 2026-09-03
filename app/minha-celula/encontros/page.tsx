import { ActionLink } from "@/components/portal-shell";
import { ContextTag, SectionLabel } from "@/components/portal-patterns";
import { genesisCellMock } from "@/data/cell";
import styles from "../minha-celula.module.css";

export default function MeetingsPage() {
  const { nextMeeting, previousMeetings, currentPerson, serviceAssignments } = genesisCellMock;
  const { study } = nextMeeting;
  const nextMeetingAssignment = serviceAssignments.find((assignment) =>
    assignment.meetingId === nextMeeting.id && assignment.personName === currentPerson.name,
  );

  return (
    <div className={styles.encountersOverview}>
      <section className={styles.contextSection} aria-labelledby="next-encounter-section">
        <SectionLabel id="next-encounter-section">Próximo encontro</SectionLabel>
        <MeetingCard>
          <ContextTag>Agenda da célula</ContextTag>
          <p className={styles.metadata}>{nextMeeting.dateLabel}</p>
          <h3 id="encounter-study-title">{study.title}</h3>
          <p className={styles.lessonLine}>{study.lessonNumber} · {study.bibleReference}</p>
          {study.referenceIsDemonstration ? <p className={styles.mockNote}>Referência bíblica demonstrativa</p> : null}

          <div className={styles.participation}>
            <span>Sua participação</span>
            <strong>{nextMeetingAssignment?.serviceFunction}</strong>
          </div>

          <div className={styles.meetingActions}>
            <ActionLink href="/minha-celula/encontros#encounter-study-title">Ver estudo</ActionLink>
            <ActionLink href="/minha-celula/escalas" variant="secondary">Ver minha escala</ActionLink>
          </div>
        </MeetingCard>
      </section>

      <section className={styles.contextSection} aria-labelledby="previous-encounters-section">
        <SectionLabel id="previous-encounters-section">Encontros anteriores</SectionLabel>
        <MeetingCard>
          <ContextTag>Histórico</ContextTag>
          <ol className={styles.encounterHistory}>
            {previousMeetings.map((meeting) => (
              <li key={meeting.dateLabel}>
                <time>{meeting.dateLabel}</time>
                <div>
                  <strong>{meeting.lessonNumber}</strong>
                  <span>{meeting.title}</span>
                  {meeting.isDemonstration ? <small>Conteúdo demonstrativo</small> : null}
                </div>
              </li>
            ))}
          </ol>
        </MeetingCard>
      </section>
    </div>
  );
}

function MeetingCard({ children }: { children: React.ReactNode }) {
  return <div className={`${styles.card} ${styles.encounterCard}`}>{children}</div>;
}
