"use client";

import { useDemo, useMeeting } from "@/components/demo-provider";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { ActionButton } from "@/components/portal-shell";
import { ContextTag, SectionLabel, StatusTag } from "@/components/portal-patterns";
import { genesisCellMock } from "@/data/cell";
import { createSessionMeetingId, secretariatMeetingsMock, type SecretariatMeeting } from "@/data/secretariat-meetings";
import styles from "../secretaria.module.css";

const normalizedTime = (time: string) => time.replace("h", ":");
const localDateKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const churchDateKey = (date: Date) => new Intl.DateTimeFormat("en-CA", { timeZone: "America/Porto_Velho", year: "numeric", month: "2-digit", day: "2-digit" }).format(date);

function weekdayIndex(weekday: string) {
  const value = weekday.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");
  return ["domingo", "segunda-feira", "terca-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sabado"].indexOf(value);
}

export function suggestNextMeetingDate(today: Date, meetings: readonly { dateIso: string }[], weekday: string) {
  const existing = new Set(meetings.map((meeting) => meeting.dateIso));
  const candidate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  const target = weekdayIndex(weekday);
  for (let offset = 0; offset < 370; offset += 1) {
    const key = localDateKey(candidate);
    if (candidate.getDay() === target && !existing.has(key)) return key;
    candidate.setDate(candidate.getDate() + 1);
  }
  return "";
}

function dateIdentity(dateIso: string) {
  const [year, month, day] = dateIso.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return {
    day: String(day).padStart(2, "0"),
    month: new Intl.DateTimeFormat("pt-BR", { month: "short" }).format(date).replace(".", "").toLocaleUpperCase("pt-BR"),
    weekday: new Intl.DateTimeFormat("pt-BR", { weekday: "long" }).format(date).replace(/^./, (letter) => letter.toLocaleUpperCase("pt-BR")),
  };
}

export function SecretariatMeetingsOverview() {
  const { created, setCreated } = useDemo();
  const [open, setOpen] = useState(false);
  const allMeetings = useMemo(() => [...secretariatMeetingsMock.upcoming, ...created, ...secretariatMeetingsMock.previous].toSorted((a, b) => `${a.dateIso}T${normalizedTime(a.startTime)}`.localeCompare(`${b.dateIso}T${normalizedTime(b.startTime)}`)), [created]);
  const today = churchDateKey(new Date());
  const allUpcoming = allMeetings.filter(meeting => meeting.dateIso >= today);
  const previousMeetings = allMeetings.filter(meeting => meeting.dateIso < today).toReversed();
  const [dateIso, setDateIso] = useState("");
  const [startTime, setStartTime] = useState(normalizedTime(genesisCellMock.startTime));
  const [feedback, setFeedback] = useState("");
  const dateRef = useRef<HTMLInputElement>(null);

  function openForm() {
    setDateIso(suggestNextMeetingDate(new Date(), allMeetings, genesisCellMock.weekday));
    setStartTime(normalizedTime(genesisCellMock.startTime)); setFeedback(""); setOpen(true);
    requestAnimationFrame(() => dateRef.current?.focus());
  }
  function cancel() { setOpen(false); setFeedback(""); }
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!dateIso || !startTime) return setFeedback("Preencha a data e o horário do encontro.");
    if (allMeetings.some((meeting) => meeting.dateIso === dateIso && normalizedTime(meeting.startTime) === startTime)) return setFeedback(`Já existe um encontro da ${genesisCellMock.name} nesta data e horário.`);
    if (new Date(`${dateIso}T${startTime}:00`).getTime() <= Date.now()) return setFeedback("Escolha uma data e um horário futuros para o encontro.");
    setCreated((current) => [...current, {
      id: createSessionMeetingId(dateIso, startTime), dateIso, startTime,
      title: "Estudo a definir", studyPending: true,
      statuses: { communication: { label: "A preparar", tone: "action" }, attendance: { label: "Após o encontro", tone: "neutral" }, report: { label: "Após o encontro", tone: "neutral" } },
    }]);
    setOpen(false); setFeedback("Encontro criado.");
  }

  return <div className={styles.meetingsOverview}>
    <section className={styles.meetingsHero} aria-labelledby="meetings-hero-title">
      <div className={styles.meetingsHeroContent}>
        <span className={styles.meetingsHeroEyebrow}>Secretaria da Célula · Gênesis</span>
        <h2 id="meetings-hero-title">Organize o <em>próximo encontro.</em></h2>
        <p>Crie um encontro e acompanhe a comunicação, a presença e o relatório em um só lugar.</p>
        <ActionButton type="button" onClick={openForm}>Criar encontro</ActionButton>
      </div>
      <ol className={styles.meetingsHeroSteps} aria-label="Etapas de um encontro"><li><span>01</span> Comunicação</li><li><span>02</span> Presença</li><li><span>03</span> Relatório</li></ol>
    </section>
    <section aria-labelledby="upcoming-meetings-label">
      <div className={styles.sectionHeadingRow}><SectionLabel id="upcoming-meetings-label">Próximos encontros</SectionLabel><span className={styles.meetingsCount}>{allUpcoming.length} cadastrado{allUpcoming.length === 1 ? "" : "s"}</span></div>
      {open ? <form className={styles.newMeetingForm} onSubmit={submit} onKeyDown={(event) => { if (event.key === "Escape") cancel(); }}>
        <div className={styles.newMeetingHeading}><div><ContextTag>Planejamento</ContextTag><h2>Novo encontro</h2></div><p>A data e o horário habituais da Gênesis são apenas sugestões.</p></div>
        <div className={styles.newMeetingFields}>
          <label><span>Data *</span><input ref={dateRef} type="date" required value={dateIso} onChange={(event) => { setDateIso(event.target.value); setFeedback(""); }} /></label>
          <label><span>Horário *</span><input type="time" required value={startTime} onChange={(event) => { setStartTime(event.target.value); setFeedback(""); }} /></label>
        </div>
        <p className={styles.newMeetingFeedback} role="status">{feedback}</p>
        <div className={styles.newMeetingActions}><ActionButton type="button" variant="secondary" onClick={cancel}>Cancelar</ActionButton><ActionButton type="submit">Criar encontro</ActionButton></div>
      </form> : null}
      {!open && feedback ? <p className={styles.createdMeetingFeedback} role="status">{feedback}</p> : null}
      {allUpcoming.length ? <article className={`${styles.card} ${styles.meetingsCard}`}><ul className={styles.meetingList}>{allUpcoming.map((meeting) => <li key={meeting.id}><MeetingLink meeting={meeting} /></li>)}</ul></article> : <div className={styles.meetingsEmptyState}><strong>Nenhum encontro futuro cadastrado.</strong><p>Os exemplos de setembro estão no histórico. Crie uma nova data para continuar a demonstração.</p></div>}
    </section>
    <section aria-label="Encontros anteriores"><details className={styles.meetingsHistory}><summary><span>Encontros anteriores</span><small>{previousMeetings.length} registro{previousMeetings.length === 1 ? "" : "s"} · abrir histórico</small></summary><article className={`${styles.card} ${styles.meetingsCard} ${styles.historyCard}`}><ul className={styles.meetingList}>{previousMeetings.map((meeting) => <li key={meeting.id}><MeetingLink meeting={meeting} /></li>)}</ul></article></details></section>
  </div>;
}

function MeetingLink({ meeting: initialMeeting }: { meeting: SecretariatMeeting }) {
  const meeting = useMeeting(initialMeeting.id) ?? initialMeeting;
  const date = dateIdentity(meeting.dateIso);
  const status = [
    { title: "Comunicação", value: meeting.statuses.communication },
    { title: "Presença", value: meeting.statuses.attendance },
    { title: "Relatório", value: meeting.statuses.report },
  ].find(item => item.value?.tone === "action" || item.value?.tone === "progress") ??
    { title: "Relatório", value: meeting.statuses.report };
  return <Link className={styles.meetingRow} href={`/secretaria/encontros/${meeting.id}`} aria-label={`${date.day} de ${date.month}: ${meeting.title}`}>
    <time className={styles.meetingDate} dateTime={meeting.dateIso}><strong>{date.day}</strong><span>{date.month}</span></time>
    <div className={styles.meetingIdentity}><strong className={meeting.studyPending ? styles.undefinedStudy : undefined}>{meeting.title}</strong><span>{date.weekday} · {meeting.startTime}</span>{meeting.study ? <small>{meeting.study.lessonNumber} · {meeting.study.bibleReference}</small> : null}</div>
    {status.value ? <span className={styles.meetingHighlight}><span>{status.title}</span><StatusTag tone={status.value.tone}>{status.value.label}</StatusTag></span> : null}
    <svg className={styles.meetingChevron} viewBox="0 0 20 20" aria-hidden="true"><path d="m7.5 4.5 5 5.5-5 5.5" /></svg>
  </Link>;
}
