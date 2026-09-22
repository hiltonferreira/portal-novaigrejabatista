"use client";

import { useEncounterOperation, useMeeting } from "@/components/demo-provider";
import { deriveAttendanceSummary } from "@/data/secretariat-attendance";
import { getSnackOrganizationByEncounterId, getSnackOrganizationSummary } from "@/data/snack-organization";
import { useState } from "react";
import { ActionButton } from "@/components/portal-shell";
import { ContextTag, SectionLabel, StatusTag } from "@/components/portal-patterns";
import { reportStatusPresentation } from "@/data/secretariat-report";
import styles from "../../../secretaria.module.css";

type Narrative = {
  meetingSummary: string;
  prayerAndFollowUp: string;
  observations: string;
};

const fields: readonly { key: keyof Narrative; label: string; placeholder: string; rows: number; compact?: boolean }[] = [
  { key: "meetingSummary", label: "Como foi o encontro?", placeholder: "Registre brevemente os principais acontecimentos do encontro.", rows: 4 },
  { key: "prayerAndFollowUp", label: "Pedidos de oração e acompanhamentos", placeholder: "Registre pedidos de oração ou situações que precisam de acompanhamento.", rows: 4 },
  { key: "observations", label: "Observações", placeholder: "Outras informações relevantes.", rows: 3, compact: true },
];

export function ReportEditor({ meetingId }: {meetingId: string}) {
  const {operation, update} = useEncounterOperation(meetingId);
  const currentMeeting = useMeeting(meetingId)!;
  const {narrative, status, snapshot} = operation;
  const meeting = {title: snapshot?.studyTitle ?? currentMeeting.title, study: currentMeeting.study};
  const attendance = deriveAttendanceSummary(snapshot?.people ?? operation.people, snapshot?.records ?? operation.records);
  const snack = getSnackOrganizationByEncounterId(meetingId);
  const gathering = snack ? getSnackOrganizationSummary(snack) : undefined;
  const [feedback, setFeedback] = useState("");
  const statusPresentation = reportStatusPresentation[status];

  function updateField(key: keyof Narrative, value: string) {
    update(current => current.status === "draft" ? {...current, narrative: {...current.narrative, [key]: value}} : current);
    setFeedback("");
  }

  function saveDraft() {
    setFeedback("Rascunho mantido nesta sessão de demonstração.");
  }

  function sendToLeader() {
    update(current => current.status === "draft" ? {...current, status: "sentToLeader", snapshot: {
      people: current.people.map(person => ({...person})), records: current.records.map(record => ({...record})),
      narrative: {...current.narrative}, studyTitle: currentMeeting.study ? `${currentMeeting.title} · ${currentMeeting.study.lessonNumber} · ${currentMeeting.study.bibleReference}` : "Estudo a definir",
    }} : current);
    setFeedback("Relatório enviado ao Líder.");
  }

  return (
    <section className={styles.reportSection} aria-labelledby="report-label">
      <SectionLabel id="report-label">Relatório do encontro</SectionLabel>
      <article className={`${styles.card} ${styles.reportCard}`}>
        <ContextTag>Após o encontro</ContextTag>
        <p className={styles.reportIntro}>Registre as informações do encontro para acompanhamento do Líder.</p>
        {snapshot ? <p>Este resumo preserva as informações enviadas. Correções após o envio ainda não estão disponíveis nesta demonstração.</p> : null}

        <div className={styles.reportLayout}>
          <div className={styles.reportMain}>
            <section className={styles.reportSummary} aria-labelledby="report-summary-title">
              <h3 id="report-summary-title">Resumo do encontro</h3>
              <dl>
                <div><dt>Estudo</dt><dd><strong>{meeting.title}</strong>{!snapshot && meeting.study ? <span>{meeting.study.lessonNumber} · {meeting.study.bibleReference}</span> : null}</dd></div>
                <div><dt>Presença</dt><dd><strong>{attendance.totalPresent} presentes</strong><span>{attendance.absent} ausentes · {attendance.unregistered} sem registro</span></dd></div>
                <div><dt>Visitantes</dt><dd>{attendance.visitors.length > 0 ? <><strong>{attendance.visitors.length} {attendance.visitors.length === 1 ? "visitante" : "visitantes"}</strong><span>{attendance.visitors.map((visitor) => visitor.name).join(", ")}</span></> : "Nenhum visitante registrado"}</dd></div>

                {gathering ? <div><dt>Confraternização</dt><dd><strong>{gathering.primary}</strong><span>{gathering.secondary}</span></dd></div> : null}
              </dl>
            </section>

            <form className={styles.reportFields} onSubmit={(event) => event.preventDefault()}>
              {fields.map((field) => (
                <label key={field.key}>
                  <span>{field.label}</span>
                  <textarea className={field.compact ? styles.reportTextareaCompact : undefined} rows={field.rows} placeholder={field.placeholder} readOnly={status !== "draft"} value={narrative[field.key]} onChange={(event) => updateField(field.key, event.target.value)} />
                </label>
              ))}
            </form>
          </div>

          <aside className={styles.reportStatus} aria-labelledby="report-status-title">
            <h3 id="report-status-title">Status do relatório</h3>
            <StatusTag tone={statusPresentation.tone}>{statusPresentation.label}</StatusTag>
            <p>{statusPresentation.description}</p>
            {status === "draft" ? (
              <div className={styles.reportActions}>
                <ActionButton type="button" variant="primary" onClick={sendToLeader}>Enviar ao Líder</ActionButton>
                <ActionButton type="button" variant="secondary" onClick={saveDraft}>Salvar rascunho</ActionButton>
              </div>
            ) : null}
            <p className={styles.reportFeedback} role="status" aria-live="polite">{feedback}</p>
          </aside>
        </div>
      </article>
    </section>
  );
}
