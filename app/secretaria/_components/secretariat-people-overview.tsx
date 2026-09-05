"use client";

import { useSyncExternalStore } from "react";
import { ContextTag, SectionLabel } from "@/components/portal-patterns";
import { formatShortDate } from "@/data/cell";
import {
  getUpcomingBirthdays,
  secretariatBirthdaysMock,
  secretariatPeopleMock,
  secretariatPeopleSummary,
  secretariatVisitorsMock,
} from "@/data/secretariat-people";
import styles from "../secretaria.module.css";

const subscribeToBrowser = () => () => undefined;

function formatBirthdayDate(dateLabel: string) {
  const [day, month] = dateLabel.split("/").map(Number);
  const monthLabel = new Intl.DateTimeFormat("pt-BR", { month: "short" })
    .format(new Date(2026, month - 1, day)).replace(".", "").toLocaleUpperCase("pt-BR");
  return { day: String(day).padStart(2, "0"), month: monthLabel };
}

export function SecretariatPeopleOverview() {
  const browserIsReady = useSyncExternalStore(subscribeToBrowser, () => true, () => false);
  const today = browserIsReady ? new Date() : new Date(2026, 0, 1);
  const birthdays = getUpcomingBirthdays(secretariatBirthdaysMock, today);

  return (
    <div className={styles.peopleOverview}>
      <section className={styles.contextSection} aria-labelledby="secretariat-visitors-label">
        <SectionLabel id="secretariat-visitors-label">Visitantes</SectionLabel>
        <article className={`${styles.card} ${styles.peopleCard}`}>
          <ContextTag>Acompanhamento</ContextTag>
          <p className={styles.peopleIntroduction}>Acompanhe quem está chegando e participando dos encontros da Gênesis.</p>
          <ul className={styles.visitorFollowUpList} aria-label="Visitantes da célula Gênesis">
            {secretariatVisitorsMock.map((visitor) => (
              <li key={visitor.id}>
                <strong>{visitor.name}</strong>
                {visitor.lastParticipationDateIso ? (
                  <div className={styles.visitorParticipationFacts}>
                    <span>Última participação · {formatShortDate(visitor.lastParticipationDateIso)}</span>
                    <span>{visitor.participationCount} {visitor.participationCount === 1 ? "encontro registrado" : "encontros registrados"}</span>
                  </div>
                ) : null}
                {visitor.invitedByName ? <span className={styles.visitorInvitation}>Convidado por {visitor.invitedByName}</span> : null}
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className={styles.contextSection} aria-labelledby="secretariat-people-label">
        <SectionLabel id="secretariat-people-label">Pessoas da célula</SectionLabel>
        <article className={`${styles.card} ${styles.peopleCard}`}>
          <ContextTag>Comunidade</ContextTag>
          <p className={styles.peopleIntroduction}>Pessoas que caminham com a Gênesis.</p>
          <p className={styles.peopleSummary}>
            {secretariatPeopleSummary.total} pessoas · {secretariatPeopleSummary.visitors} {secretariatPeopleSummary.visitors === 1 ? "visitante" : "visitantes"}
          </p>
          <ul className={styles.secretariatPeopleList} aria-label="Pessoas acompanhadas pela célula Gênesis">
            {secretariatPeopleMock.map((person) => (
              <li key={person.id}>
                <strong>{person.name}</strong>
                <span>{person.cellRoles.length > 0 ? person.cellRoles.join(" · ") : person.churchRelationshipLabel}</span>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className={styles.contextSection} aria-labelledby="secretariat-birthdays-label">
        <SectionLabel id="secretariat-birthdays-label">Próximos aniversários</SectionLabel>
        <article className={`${styles.card} ${styles.peopleCard}`}>
          <ContextTag>Comunidade</ContextTag>
          <ol className={styles.secretariatBirthdayList} aria-label="Próximos aniversários da célula Gênesis">
            {birthdays.map((person) => {
              const date = formatBirthdayDate(person.dateLabel);
              return (
                <li key={`${person.name}-${person.dateLabel}`}>
                  <time dateTime={person.dateLabel}><strong>{date.day}</strong><span>{date.month}</span></time>
                  <span>{person.name}</span>
                </li>
              );
            })}
          </ol>
        </article>
      </section>
    </div>
  );
}
