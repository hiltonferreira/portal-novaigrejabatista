"use client";

import { useSyncExternalStore } from "react";
import { ContextTag, SectionLabel } from "@/components/portal-patterns";
import { deriveSecretariatHistory } from "@/data/secretariat-history";
import styles from "../secretaria.module.css";

const subscribeToBrowser = () => () => undefined;

function formatHistoryDate(dateIso: string) {
  const [year, month, day] = dateIso.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return {
    day: String(day).padStart(2, "0"),
    month: new Intl.DateTimeFormat("pt-BR", { month: "short" }).format(date).replace(".", "").toLocaleUpperCase("pt-BR"),
    natural: new Intl.DateTimeFormat("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
    }).format(date).replace(/^./, (character) => character.toLocaleUpperCase("pt-BR")),
  };
}

function formatEventMoment(occurredAt: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(occurredAt)).replace(",", " ·");
}

export function SecretariatHistoryOverview() {
  const browserIsReady = useSyncExternalStore(subscribeToBrowser, () => true, () => false);
  const entries = deriveSecretariatHistory(browserIsReady ? new Date() : new Date(2026, 8, 4));

  return (
    <div className={styles.historyOverview}>
      <section className={styles.contextSection} aria-labelledby="secretariat-history-label">
        <SectionLabel id="secretariat-history-label">Histórico da Secretaria</SectionLabel>
        <article className={`${styles.card} ${styles.historyTimelineCard}`}>
          <ContextTag>Registros</ContextTag>
          <p className={styles.historyIntroduction}>Acompanhe os registros realizados nos encontros da Gênesis.</p>

          {entries.length > 0 ? (
            <ol className={styles.historyTimeline} aria-label="Registros da Secretaria por encontro">
              {entries.map((entry) => {
                const date = formatHistoryDate(entry.dateIso);
                return (
                  <li className={styles.historyEntry} key={entry.encounterId}>
                    <time className={styles.historyEntryDate} dateTime={entry.dateIso}>
                      <strong>{date.day}</strong>
                      <span>{date.month}</span>
                    </time>
                    <div className={styles.historyEntryContent}>
                      <header>
                        <h2>{entry.title}</h2>
                        <p>{date.natural} · {entry.startTime}</p>
                      </header>
                      <ol className={styles.historyFacts}>
                        {entry.events.map((event) => (
                          <li key={event.id}>
                            <strong>{event.title}</strong>
                            {event.detail ? <span>{event.detail}</span> : null}
                            {event.actor ? <span>{event.actor.name} · {event.actor.contextualRole}</span> : null}
                            {event.occurredAt ? <time dateTime={event.occurredAt}>{formatEventMoment(event.occurredAt)}</time> : null}
                          </li>
                        ))}
                      </ol>
                    </div>
                  </li>
                );
              })}
            </ol>
          ) : (
            <p className={styles.historyEmpty}>Ainda não há registros concluídos para exibir.</p>
          )}
        </article>
      </section>
    </div>
  );
}
