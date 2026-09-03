"use client";

import { useState } from "react";
import { ActionButton } from "@/components/portal-shell";
import { ContextTag, SectionLabel, StatusTag } from "@/components/portal-patterns";
import { reportStatusPresentation, type ReportStatus } from "@/data/secretariat-report";
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

export function ReportEditor({ meeting, attendance, gathering, initialReport }: {
  meeting: { title: string; study: { lessonNumber: string; bibleReference: string } };
  attendance: { totalPresent: number; absent: number; visitors: readonly { id: string; name: string }[] };
  gathering: string;
  initialReport: { status: ReportStatus; narrative: Narrative };
}) {
  const [narrative, setNarrative] = useState<Narrative>({ ...initialReport.narrative });
  const [status, setStatus] = useState<ReportStatus>(initialReport.status);
  const [feedback, setFeedback] = useState("");
  const statusPresentation = reportStatusPresentation[status];

  function updateField(key: keyof Narrative, value: string) {
    setNarrative((current) => ({ ...current, [key]: value }));
    setFeedback("");
  }

  function saveDraft() {
    setFeedback("Rascunho salvo.");
  }

  function sendToLeader() {
    setStatus("sentToLeader");
    setFeedback("Relatório enviado ao Líder.");
  }

  return (
    <section className={styles.reportSection} aria-labelledby="report-label">
      <SectionLabel id="report-label">Relatório do encontro</SectionLabel>
      <article className={`${styles.card} ${styles.reportCard}`}>
        <ContextTag>Após o encontro</ContextTag>
        <p className={styles.reportIntro}>Registre as informações do encontro para acompanhamento do Líder.</p>

        <div className={styles.reportLayout}>
          <div className={styles.reportMain}>
            <section className={styles.reportSummary} aria-labelledby="report-summary-title">
              <h3 id="report-summary-title">Resumo do encontro</h3>
              <dl>
                <div><dt>Estudo</dt><dd><strong>{meeting.title}</strong><span>{meeting.study.lessonNumber} · {meeting.study.bibleReference}</span></dd></div>
                <div><dt>Presença</dt><dd><strong>{attendance.totalPresent} presentes</strong><span>{attendance.absent} ausentes</span></dd></div>
                <div><dt>Visitantes</dt><dd>{attendance.visitors.length > 0 ? <><strong>{attendance.visitors.length} {attendance.visitors.length === 1 ? "visitante" : "visitantes"}</strong><span>{attendance.visitors.map((visitor) => visitor.name).join(", ")}</span></> : "Nenhum visitante registrado"}</dd></div>
                <div><dt>Confraternização</dt><dd>{gathering}</dd></div>
              </dl>
            </section>

            <form className={styles.reportFields} onSubmit={(event) => event.preventDefault()}>
              {fields.map((field) => (
                <label key={field.key}>
                  <span>{field.label}</span>
                  <textarea className={field.compact ? styles.reportTextareaCompact : undefined} rows={field.rows} placeholder={field.placeholder} value={narrative[field.key]} onChange={(event) => updateField(field.key, event.target.value)} />
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
