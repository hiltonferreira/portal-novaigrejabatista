"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ActionButton } from "@/components/portal-shell";
import { ContextTag, SectionBlock, StatusTag, type StatusTone } from "@/components/portal-patterns";
import { createPastoralStudyId, createStudyScheduleId, normalizeLessonNumber, pastoralStudiesMock, studySchedulesMock, type PastoralStudy, type StudySchedule } from "@/data/pastoral-studies";
import { addCalendarWeeks, formatLocalDateKey, formatStudyWeek, getCalendarWeek, startOfCalendarWeek } from "@/data/temporal-context";
import styles from "../pastor.module.css";

type StudyForm = { series: string; lessonNumber: string; title: string; baseReference: string };
const emptyForm: StudyForm = { series: "", lessonNumber: "", title: "", baseReference: "" };
const studyStatuses: Record<"unscheduled" | "pdfUnavailable", { label: string; tone: StatusTone }> = {
  unscheduled: { label: "Ainda não programado", tone: "action" },
  pdfUnavailable: { label: "PDF indisponível nesta sessão", tone: "neutral" },
};

export function PastoralStudiesOverview() {
  const [studies, setStudies] = useState<PastoralStudy[]>([...pastoralStudiesMock]);
  const [schedules, setSchedules] = useState<StudySchedule[]>([...studySchedulesMock]);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<StudyForm>(emptyForm);
  const [pdf, setPdf] = useState<File | null>(null);
  const [feedback, setFeedback] = useState("");
  const [successFeedback, setSuccessFeedback] = useState("");
  const [schedulingStudyId, setSchedulingStudyId] = useState<string | null>(null);
  const [selectedWeekStart, setSelectedWeekStart] = useState("");
  const [otherWeekOpen, setOtherWeekOpen] = useState(false);
  const [addingPdfStudyId, setAddingPdfStudyId] = useState<string | null>(null);
  const [pdfToAdd, setPdfToAdd] = useState<File | null>(null);
  const [editingStudyId, setEditingStudyId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<StudyForm>(emptyForm);
  const fileRef = useRef<HTMLInputElement>(null);
  const sessionObjectUrls = useRef(new Set<string>());

  const quickWeeks = useMemo(() => {
    const currentWeek = formatLocalDateKey(startOfCalendarWeek(new Date()));
    return Array.from({ length: 4 }, (_, index) => addCalendarWeeks(currentWeek, index + 1));
  }, []);
  const orderedStudies = useMemo(() => studies
    .map((study, index) => ({ study, index, schedule: schedules.find((item) => item.studyId === study.id) }))
    .sort((left, right) => {
      if (left.schedule && right.schedule) return left.schedule.weekStart.localeCompare(right.schedule.weekStart);
      if (left.schedule) return -1;
      if (right.schedule) return 1;
      return left.index - right.index;
    }), [schedules, studies]);

  useEffect(() => {
    const urls = sessionObjectUrls.current;
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, []);
  useEffect(() => {
    if (!successFeedback) return;
    const timer = window.setTimeout(() => setSuccessFeedback(""), 2600);
    return () => window.clearTimeout(timer);
  }, [successFeedback]);

  function openForm() {
    setForm(emptyForm); setPdf(null); setFeedback(""); setSchedulingStudyId(null); setAddingPdfStudyId(null); setEditingStudyId(null); setFormOpen(true);
    requestAnimationFrame(() => fileRef.current?.focus());
  }
  function closeForm() { setFormOpen(false); setFeedback(""); }
  function updateField(field: keyof StudyForm, value: string) { setForm((current) => ({ ...current, [field]: value })); setFeedback(""); }
  function selectPdf(file: File | undefined) {
    if (!file) { setPdf(null); return; }
    if (file.type !== "application/pdf" && !file.name.toLocaleLowerCase("pt-BR").endsWith(".pdf")) {
      setPdf(null); setFeedback("Selecione um arquivo PDF para a lição."); return;
    }
    setPdf(file); setFeedback("");
  }
  function saveStudy(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!pdf || Object.values(form).some((value) => !value.trim())) {
      setFeedback("Selecione o PDF e preencha todos os metadados do estudo."); return;
    }
    const objectUrl = URL.createObjectURL(pdf);
    sessionObjectUrls.current.add(objectUrl);
    setStudies((current) => [...current, {
      id: createPastoralStudyId(), series: form.series.trim(), lessonNumber: normalizeLessonNumber(form.lessonNumber),
      title: form.title.trim(), baseReference: form.baseReference.trim(), pdf: { fileName: pdf.name, objectUrl },
    }]);
    setFormOpen(false); setSuccessFeedback("✓ Estudo salvo.");
  }
  function openScheduler(studyId: string, currentWeekStart = "") {
    setAddingPdfStudyId(null); setPdfToAdd(null); setEditingStudyId(null);
    setSchedulingStudyId(studyId); setSelectedWeekStart(currentWeekStart);
    setOtherWeekOpen(Boolean(currentWeekStart && !quickWeeks.includes(currentWeekStart))); setFeedback("");
  }
  function closeScheduler() { setSchedulingStudyId(null); setSelectedWeekStart(""); setOtherWeekOpen(false); setFeedback(""); }
  function saveSchedule(studyId: string) {
    if (!selectedWeekStart) { setFeedback("Escolha uma semana para programar o estudo."); return; }
    const conflict = schedules.find((schedule) => schedule.weekStart === selectedWeekStart && schedule.studyId !== studyId);
    if (conflict) { setFeedback("Já existe outro estudo programado para esta semana."); return; }
    const existingSchedule = schedules.find((schedule) => schedule.studyId === studyId);
    if (existingSchedule) {
      setSchedules((current) => current.map((schedule) => schedule.id === existingSchedule.id ? { ...schedule, weekStart: selectedWeekStart } : schedule));
      setSuccessFeedback("✓ Semana atualizada.");
    } else {
      setSchedules((current) => [...current, { id: createStudyScheduleId(), studyId, weekStart: selectedWeekStart }]);
      setSuccessFeedback("✓ Estudo programado.");
    }
    closeScheduler();
  }
  function openPdfFlow(studyId: string) {
    setSchedulingStudyId(null); setEditingStudyId(null); setAddingPdfStudyId(studyId); setPdfToAdd(null); setFeedback("");
  }
  function closePdfFlow() { setAddingPdfStudyId(null); setPdfToAdd(null); setFeedback(""); }
  function selectAdditionalPdf(file: File | undefined) {
    if (!file) { setPdfToAdd(null); return; }
    if (file.type !== "application/pdf" && !file.name.toLocaleLowerCase("pt-BR").endsWith(".pdf")) {
      setPdfToAdd(null); setFeedback("Selecione um arquivo PDF para a lição."); return;
    }
    setPdfToAdd(file); setFeedback("");
  }
  function savePdf(studyId: string) {
    if (!pdfToAdd) { setFeedback("Selecione o PDF da lição."); return; }
    const currentStudy = studies.find((study) => study.id === studyId);
    const replacing = Boolean(currentStudy?.pdf.objectUrl);
    const objectUrl = URL.createObjectURL(pdfToAdd);
    sessionObjectUrls.current.add(objectUrl);
    const previousObjectUrl = currentStudy?.pdf.objectUrl;
    if (previousObjectUrl && sessionObjectUrls.current.has(previousObjectUrl)) {
      URL.revokeObjectURL(previousObjectUrl);
      sessionObjectUrls.current.delete(previousObjectUrl);
    }
    setStudies((current) => current.map((study) => study.id === studyId
      ? { ...study, pdf: { fileName: pdfToAdd.name, objectUrl } }
      : study));
    closePdfFlow(); setSuccessFeedback(replacing ? "✓ PDF substituído." : "✓ PDF adicionado.");
  }
  function openEditFlow(study: PastoralStudy) {
    setSchedulingStudyId(null); setAddingPdfStudyId(null); setPdfToAdd(null);
    setEditingStudyId(study.id);
    setEditForm({ series: study.series, lessonNumber: study.lessonNumber, title: study.title, baseReference: study.baseReference });
    setFeedback("");
  }
  function closeEditFlow() { setEditingStudyId(null); setEditForm(emptyForm); setFeedback(""); }
  function updateEditField(field: keyof StudyForm, value: string) {
    setEditForm((current) => ({ ...current, [field]: value })); setFeedback("");
  }
  function saveStudyChanges(studyId: string) {
    if (Object.values(editForm).some((value) => !value.trim())) {
      setFeedback("Preencha todos os metadados obrigatórios do estudo."); return;
    }
    setStudies((current) => current.map((study) => study.id === studyId ? {
      ...study,
      series: editForm.series.trim(),
      lessonNumber: normalizeLessonNumber(editForm.lessonNumber),
      title: editForm.title.trim(),
      baseReference: editForm.baseReference.trim(),
    } : study));
    closeEditFlow(); setSuccessFeedback("✓ Estudo atualizado.");
  }

  return <div className={styles.studiesOverview}>
    <SectionBlock id="pastoral-studies-label" label="Estudos" action={<ActionButton type="button" onClick={openForm}>+ Novo estudo</ActionButton>}>
    {formOpen ? <form className={styles.studyForm} onSubmit={saveStudy} onKeyDown={(event) => { if (event.key === "Escape") closeForm(); }}>
      <button type="button" className={styles.backToStudies} onClick={closeForm}>‹ Voltar para estudos</button>
      <div className={styles.formHeading}><ContextTag>Conteúdo oficial</ContextTag><h2>Novo estudo</h2><p>O PDF guarda o conteúdo da lição. Registre somente os metadados necessários para identificá-la.</p></div>
      <div className={styles.studyFields}>
        <label className={styles.pdfField}><span>PDF da lição *</span><input ref={fileRef} type="file" accept="application/pdf,.pdf" required onChange={(event) => selectPdf(event.target.files?.[0])} /></label>
        <label><span>Série *</span><input required value={form.series} onChange={(event) => updateField("series", event.target.value)} /></label>
        <label><span>Lição *</span><input required inputMode="numeric" value={form.lessonNumber} onChange={(event) => updateField("lessonNumber", event.target.value)} /></label>
        <label><span>Título *</span><input required value={form.title} onChange={(event) => updateField("title", event.target.value)} /></label>
        <label><span>Texto-base *</span><input required value={form.baseReference} onChange={(event) => updateField("baseReference", event.target.value)} /></label>
      </div>
      <p className={styles.feedback} role="status">{feedback}</p>
      <div className={styles.formActions}><ActionButton type="button" variant="secondary" onClick={closeForm}>Cancelar</ActionButton><ActionButton type="submit">Salvar estudo</ActionButton></div>
    </form> : null}
    <article className={styles.studiesCard}><ContextTag>Lições oficiais</ContextTag><ol className={styles.studyList}>
      {orderedStudies.map(({ study, schedule }) => {
        const scheduling = schedulingStudyId === study.id;
        const editing = editingStudyId === study.id;
        const replacingPdf = addingPdfStudyId === study.id && Boolean(study.pdf.objectUrl);
        return <li key={study.id}>
          <div className={styles.lessonNumber}><span>Lição</span><strong>{study.lessonNumber}</strong></div>
          <div className={styles.studyIdentity}><h2>{study.title}</h2><p>{study.series}</p><span>{study.baseReference}</span></div>
          <div className={styles.studyContext}>
            {schedule ? <p><strong>Semana de estudo</strong><span>{formatStudyWeek(schedule.weekStart)}</span></p> : null}
            <div className={styles.studyStatuses}>
              {!schedule ? <StatusTag tone={studyStatuses.unscheduled.tone}>{studyStatuses.unscheduled.label}</StatusTag> : null}
              {!study.pdf.objectUrl ? <StatusTag tone={studyStatuses.pdfUnavailable.tone}>{studyStatuses.pdfUnavailable.label}</StatusTag> : null}
            </div>
            <div className={styles.studyActionGroups}>
              {study.pdf.objectUrl ? <div className={styles.studyPrimaryAction}><a className={`action-link ${styles.primaryNavy}`} href={study.pdf.objectUrl} target="_blank" rel="noopener noreferrer">Visualizar PDF</a></div> : null}
              <div className={styles.studyActions}>
                <ActionButton type="button" variant="secondary" onClick={() => openEditFlow(study)}>Editar estudo</ActionButton>
                <ActionButton type="button" variant="secondary" onClick={() => openPdfFlow(study.id)}>{study.pdf.objectUrl ? "Substituir PDF" : "Adicionar PDF"}</ActionButton>
                <ActionButton type="button" variant="secondary" className={!schedule ? styles.programStudyAction : ""} onClick={() => openScheduler(study.id, schedule?.weekStart)}>{schedule ? "Alterar semana" : "Programar estudo"}</ActionButton>
              </div>
            </div>
            {addingPdfStudyId === study.id ? <div className={styles.pdfPanel}>
              <div className={styles.scheduleHeading}><strong>{replacingPdf ? "Substituir PDF" : "Adicionar PDF"}</strong><span>{replacingPdf ? "Selecione o novo PDF oficial desta lição." : "Complete somente o arquivo desta lição."}</span></div>
              {replacingPdf ? <p className={styles.currentPdf}><strong>PDF atual</strong><span>{study.pdf.fileName}</span></p> : null}
              <label><span>{replacingPdf ? "Novo PDF *" : "PDF da lição *"}</span><input type="file" accept="application/pdf,.pdf" onChange={(event) => selectAdditionalPdf(event.target.files?.[0])} /></label>
              <p className={styles.feedback} role="status">{feedback}</p>
              <div className={styles.scheduleActions}><ActionButton type="button" variant="secondary" onClick={closePdfFlow}>Cancelar</ActionButton><ActionButton type="button" onClick={() => savePdf(study.id)}>{replacingPdf ? "Substituir PDF" : "Adicionar PDF"}</ActionButton></div>
            </div> : null}
            {editing ? <div className={styles.editPanel}>
              <div className={styles.scheduleHeading}><strong>Editar estudo</strong><span>Atualize somente os metadados desta lição.</span></div>
              <div className={styles.editFields}>
                <label><span>Série *</span><input required value={editForm.series} onChange={(event) => updateEditField("series", event.target.value)} /></label>
                <label><span>Lição *</span><input required inputMode="numeric" value={editForm.lessonNumber} onChange={(event) => updateEditField("lessonNumber", event.target.value)} /></label>
                <label><span>Título *</span><input required value={editForm.title} onChange={(event) => updateEditField("title", event.target.value)} /></label>
                <label><span>Texto-base *</span><input required value={editForm.baseReference} onChange={(event) => updateEditField("baseReference", event.target.value)} /></label>
              </div>
              <p className={styles.feedback} role="status">{feedback}</p>
              <div className={styles.scheduleActions}><ActionButton type="button" variant="secondary" onClick={closeEditFlow}>Cancelar</ActionButton><ActionButton type="button" onClick={() => saveStudyChanges(study.id)}>Salvar alterações</ActionButton></div>
            </div> : null}
            {scheduling ? <div className={styles.schedulePanel}>
              <div className={styles.scheduleHeading}><strong>{schedule ? "Alterar semana" : "Programar estudo"}</strong><span>Escolha quando esta lição será estudada por todas as células.</span></div>
              <div className={styles.weekOptions} aria-label="Próximas semanas">
                {quickWeeks.map((weekStart) => {
                  const occupiedSchedule = schedules.find((candidate) => candidate.weekStart === weekStart && candidate.studyId !== study.id);
                  const occupiedStudy = studies.find((candidate) => candidate.id === occupiedSchedule?.studyId);
                  const selected = selectedWeekStart === weekStart;
                  return <button type="button" key={weekStart} className={`${styles.weekOption}${selected ? ` ${styles.weekOptionSelected}` : ""}${occupiedSchedule ? ` ${styles.weekOptionOccupied}` : ""}`} aria-pressed={selected} disabled={Boolean(occupiedSchedule)} onClick={() => { setSelectedWeekStart(weekStart); setFeedback(""); }}>
                    <strong>{formatStudyWeek(weekStart)}</strong><span>{occupiedStudy ? `Ocupada · Lição ${occupiedStudy.lessonNumber} · ${occupiedStudy.title}` : "Disponível"}</span>
                  </button>;
                })}
              </div>
              <button type="button" className={styles.otherWeekButton} aria-expanded={otherWeekOpen} onClick={() => setOtherWeekOpen((current) => !current)}>Escolher outra semana</button>
              {otherWeekOpen ? <label className={styles.otherWeekField}><span>Data de referência *</span><input type="date" value={selectedWeekStart} onChange={(event) => { setSelectedWeekStart(event.target.value ? getCalendarWeek(event.target.value).weekStart : ""); setFeedback(""); }} /></label> : null}
              {selectedWeekStart ? <p className={styles.selectedWeek}><strong>Semana selecionada</strong><span>{formatStudyWeek(selectedWeekStart)}</span></p> : null}
              <p className={styles.feedback} role="status">{feedback}</p>
              <div className={styles.scheduleActions}><ActionButton type="button" variant="secondary" onClick={closeScheduler}>Cancelar</ActionButton><ActionButton type="button" onClick={() => saveSchedule(study.id)}>{schedule ? "Salvar alteração" : "Programar estudo"}</ActionButton></div>
            </div> : null}
          </div>
        </li>;
      })}
    </ol></article>
    <p className={styles.pageFeedback} role="status" aria-live="polite">{!formOpen ? successFeedback : ""}</p>
    </SectionBlock>
  </div>;
}
