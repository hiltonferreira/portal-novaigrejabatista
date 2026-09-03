"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { ActionButton } from "@/components/portal-shell";
import { ContextTag, SectionLabel, StatusTag } from "@/components/portal-patterns";
import styles from "../../../secretaria.module.css";

type Meeting = {
  id: string;
  dateIso: string;
  startTime: string;
  title: string;
  study: { lessonNumber: string; bibleReference: string };
};

type Communication = {
  status: { label: string; tone: "neutral" | "action" | "progress" | "success" };
  gathering: { label: string; symbol: string; description: string };
  schedulePath: string;
};

type ServiceAssignmentGroup = {
  serviceFunction: string;
  symbol: string;
  assignments: readonly string[];
};

const subscribeToOrigin = () => () => undefined;
const getOrigin = () => window.location.origin;
const getServerOrigin = () => "";

function buildCommunication(meeting: Meeting, communication: Communication, serviceAssignments: readonly ServiceAssignmentGroup[], includeFullSchedule: boolean, origin: string) {
  const [year, month, day] = meeting.dateIso.split("-");
  const scheduleUrl = `${origin}${communication.schedulePath}`;
  const heading = `${meeting.study.lessonNumber.toLocaleUpperCase("pt-BR")} — ${meeting.title.toLocaleUpperCase("pt-BR")}`;
  const gatheringDescription = `${communication.gathering.description.charAt(0).toLocaleLowerCase("pt-BR")}${communication.gathering.description.slice(1)}`;
  const schedule = includeFullSchedule
    ? [
        "Escala de Serviço:",
        "",
        ...serviceAssignments.flatMap((service) => [
          `${service.symbol} ${service.serviceFunction}: ${service.assignments.map((name) => `@${name}`).join(" & ")}`,
          "",
        ]),
        "📋 Confira sua escala atualizada no Portal da Nova Igreja Batista:",
      ]
    : [
        "📋 Escala de Serviço",
        "",
        "Confira sua escala e as funções do próximo encontro no Portal da Nova Igreja Batista:",
      ];

  return [
    heading,
    meeting.study.bibleReference,
    "",
    `Data: Terça, dia ${day}/${month}/${year} às ${meeting.startTime}`,
    "",
    "Favor chegar no horário.",
    "",
    ...schedule,
    "",
    scheduleUrl,
    "",
    `${communication.gathering.symbol} ${communication.gathering.label}: ${gatheringDescription}`,
  ].join("\n");
}

export function CommunicationEditor({ meeting, communication, serviceAssignments }: {
  meeting: Meeting;
  communication: Communication;
  serviceAssignments: readonly ServiceAssignmentGroup[];
}) {
  const origin = useSyncExternalStore(subscribeToOrigin, getOrigin, getServerOrigin);
  const [includeFullSchedule, setIncludeFullSchedule] = useState(false);
  const [manualText, setManualText] = useState<string | null>(null);
  const [copyState, setCopyState] = useState<"idle" | "success" | "error">("idle");
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasSchedule = serviceAssignments.length > 0;
  const suggestedText = useMemo(
    () => buildCommunication(meeting, communication, serviceAssignments, hasSchedule && includeFullSchedule, origin),
    [communication, hasSchedule, includeFullSchedule, meeting, origin, serviceAssignments],
  );
  const preview = manualText ?? suggestedText;

  useEffect(() => () => {
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
  }, []);

  function clearCopyFeedback() {
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    feedbackTimer.current = null;
    setCopyState("idle");
  }

  function updateSchedulePreference(checked: boolean) {
    setIncludeFullSchedule(checked);
    setManualText(null);
    clearCopyFeedback();
  }

  function restoreSuggestedText() {
    setManualText(null);
    clearCopyFeedback();
  }

  async function copyCommunication() {
    try {
      await navigator.clipboard.writeText(preview);
      if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
      setCopyState("success");
      feedbackTimer.current = setTimeout(() => {
        setCopyState("idle");
        feedbackTimer.current = null;
      }, 2000);
    } catch {
      clearCopyFeedback();
      setCopyState("error");
    }
  }

  return (
    <section className={styles.communicationSection} aria-labelledby="communication-label">
      <SectionLabel id="communication-label">Comunicação do encontro</SectionLabel>
      <article className={`${styles.card} ${styles.communicationCard}`}>
        <ContextTag>Antes do encontro</ContextTag>
        <p className={styles.communicationIntro}>A comunicação reúne as informações do encontro para compartilhamento com a célula.</p>

        <div className={styles.communicationGrid}>
          <div className={styles.communicationInformation}>
            <div className={styles.communicationSubheading}>
              <h3>Informações utilizadas</h3>
              <StatusTag tone={communication.status.tone}>{communication.status.label}</StatusTag>
            </div>
            <dl className={styles.sourceInformation}>
              <div><dt>Estudo</dt><dd><strong>{meeting.title}</strong><span>{meeting.study.lessonNumber} · {meeting.study.bibleReference}</span></dd></div>
              <div><dt>Data e horário</dt><dd>Terça-feira · {meeting.dateIso.slice(8, 10)}/{meeting.dateIso.slice(5, 7)} · {meeting.startTime}</dd></div>
              <div><dt>Escala</dt><dd>{hasSchedule ? `${serviceAssignments.length} funções de serviço` : <StatusTag tone="neutral">Ainda não definida</StatusTag>}</dd></div>
              <div><dt>Confraternização</dt><dd>{communication.gathering.description}</dd></div>
            </dl>
            <label className={styles.scheduleControl}>
              <input
                type="checkbox"
                checked={includeFullSchedule}
                disabled={!hasSchedule}
                onChange={(event) => updateSchedulePreference(event.target.checked)}
              />
              <span>
                <strong>Incluir escala completa na mensagem</strong>
                <small>{hasSchedule ? "Ao alterar esta opção, a prévia é regenerada com os dados atuais." : "A escala completa poderá ser incluída depois que o Líder definir a escala deste encontro."}</small>
              </span>
            </label>
          </div>

          <div className={styles.communicationPreview}>
            <label htmlFor="communication-preview">Prévia da comunicação</label>
            <textarea
              id="communication-preview"
              value={preview}
              onChange={(event) => { setManualText(event.target.value); clearCopyFeedback(); }}
              spellCheck="true"
            />
            <div className={styles.communicationActions}>
              <ActionButton
                type="button"
                variant="primary"
                className={copyState === "success" ? styles.copyButtonSuccess : ""}
                onClick={copyCommunication}
              >
                {copyState === "success" ? "✓ Texto copiado" : "Copiar comunicação"}
              </ActionButton>
              <ActionButton type="button" variant="secondary" onClick={restoreSuggestedText}>Restaurar texto sugerido</ActionButton>
            </div>
            <p className={`${styles.copyFeedback} ${copyState === "success" ? styles.copyFeedbackSuccess : ""}`} role="status" aria-live="polite">
              {copyState === "success" ? "✓ Comunicação copiada." : copyState === "error" ? "Não foi possível copiar a comunicação." : ""}
            </p>
          </div>
        </div>
      </article>
    </section>
  );
}
