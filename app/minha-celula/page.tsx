import { ActionLink } from "@/components/portal-shell";
import { ContextTag, SectionLabel } from "@/components/portal-patterns";
import { genesisCellMock } from "@/data/cell";
import { AvailabilityCard } from "./_components/availability-card";
import styles from "./minha-celula.module.css";

export default function MyCellOverview() {
  const { nextMeeting, currentPerson, serviceAssignments, leadership, birthdays } = genesisCellMock;
  const { study } = nextMeeting;
  const nextMeetingAssignment = serviceAssignments.find((assignment) =>
    assignment.meetingId === nextMeeting.id && assignment.personName === currentPerson.name,
  );

  return (
    <section className={styles.overview}>
      <div className={styles.overviewGrid}>
        <div className={styles.primaryGrid}>
          <section className={styles.contextSection} aria-labelledby="meeting-section-title">
            <SectionLabel id="meeting-section-title" level={3}>Agenda da célula</SectionLabel>
            <article className={`${styles.card} ${styles.meetingCard}`} aria-labelledby="next-meeting-title">
              <ContextTag>Próximo encontro</ContextTag>
              <p className={styles.metadata}>{nextMeeting.dateLabel}</p>
              <h3 id="next-meeting-title">{study.title}</h3>
              <p className={styles.lessonLine}>{study.lessonNumber} · {study.bibleReference}</p>
              {study.referenceIsDemonstration ? <p className={styles.mockNote}>Referência bíblica demonstrativa</p> : null}
              <div className={styles.participation}>
                <span>Sua participação</span>
                <strong>{nextMeetingAssignment?.serviceFunction}</strong>
              </div>
              <div className={styles.meetingActions}>
                <ActionLink href="/minha-celula/encontros">Ver encontro</ActionLink>
                <ActionLink href="/minha-celula/encontros" variant="secondary">Ver estudo</ActionLink>
              </div>
            </article>
          </section>

          <section className={styles.contextSection} aria-labelledby="availability-title">
            <SectionLabel id="availability-title" level={3}>Seu serviço</SectionLabel>
            <AvailabilityCard
              availableForSchedule={currentPerson.availableForSchedule}
              enabledServiceFunctions={currentPerson.enabledServiceFunctions}
            />
          </section>
        </div>

        <section className={styles.contextSection} aria-labelledby="community-title">
          <SectionLabel id="community-title" level={3}>Membros da Gênesis</SectionLabel>
          <div className={`${styles.card} ${styles.community}`}>
            <ContextTag>Comunidade</ContextTag>
            <div className={styles.communityGrid}>
              <section className={styles.communitySection} aria-labelledby="leadership-title">
                <div className={styles.sectionHeading}>
                  <h3 id="leadership-title">Liderança da célula</h3>
                </div>
                <dl className={styles.leadershipList}>
                  {leadership.map((person) => <div key={person.role}><dt>{person.role}</dt><dd>{person.name}</dd></div>)}
                </dl>
              </section>

              <section className={styles.communitySection} aria-labelledby="birthdays-title">
                <div className={styles.sectionHeading}>
                  <h3 id="birthdays-title">Aniversários da célula</h3>
                </div>
                <ul className={styles.birthdayList}>
                  {birthdays.map((person) => <li key={`${person.name}-${person.dateLabel}`}><span>{person.name}</span><time>{person.dateLabel}</time></li>)}
                </ul>
              </section>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
