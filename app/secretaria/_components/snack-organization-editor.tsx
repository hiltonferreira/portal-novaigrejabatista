"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ActionButton } from "@/components/portal-shell";
import { ContextTag, SectionLabel } from "@/components/portal-patterns";
import type { SnackOrganization, SnackPerson } from "@/data/snack-organization";
import {
  getMonthRelation,
  getSnackPlanningOccurrences,
  isOccurrenceEligible,
  type CellMeetingSchedule,
  type PlanningEncounter,
  type SnackPlanningOccurrence,
} from "@/data/snack-planning";
import styles from "../secretaria.module.css";

type EditableSnackOrganization =
  | Omit<Extract<SnackOrganization, { type: "peopleRotation" }>, "participants"> & {
      participants: { personId: string; isResponsible: boolean }[];
    }
  | Extract<SnackOrganization, { type: "collectiveContribution" }>;

function copyOrganizations(organizations: readonly SnackOrganization[]): EditableSnackOrganization[] {
  return organizations.map((organization) => organization.type === "peopleRotation"
    ? { ...organization, participants: organization.participants.map((participant) => ({ ...participant })) }
    : { ...organization });
}

function copyOrganization(organization: EditableSnackOrganization): EditableSnackOrganization {
  return organization.type === "peopleRotation"
    ? { ...organization, participants: organization.participants.map((participant) => ({ ...participant })) }
    : { ...organization };
}

function formatDateParts(dateIso: string) {
  const date = new Date(`${dateIso}T12:00:00Z`);
  return {
    day: new Intl.DateTimeFormat("pt-BR", { day: "2-digit", timeZone: "UTC" }).format(date),
    month: new Intl.DateTimeFormat("pt-BR", { month: "short", timeZone: "UTC" })
      .format(date).replace(".", "").toLocaleUpperCase("pt-BR"),
    monthLong: new Intl.DateTimeFormat("pt-BR", { month: "long", timeZone: "UTC" }).format(date),
  };
}

function formatWeekday(dateIso: string) {
  const label = new Intl.DateTimeFormat("pt-BR", { weekday: "long", timeZone: "UTC" })
    .format(new Date(`${dateIso}T12:00:00Z`));
  return label.charAt(0).toLocaleUpperCase("pt-BR") + label.slice(1);
}

function formatNames(names: readonly string[]) {
  return new Intl.ListFormat("pt-BR", { style: "long", type: "conjunction" }).format(names);
}

function isOrganizationFilled(organization: EditableSnackOrganization) {
  return organization.type === "collectiveContribution"
    ? organization.purpose.trim().length > 0 && organization.amountPerPerson.trim().length > 0
    : organization.participants.length > 0;
}

function buildMonthlyMessage(organizations: readonly EditableSnackOrganization[], people: readonly SnackPerson[], monthName: string) {
  const personById = new Map(people.map((person) => [person.id, person]));
  const lines = [
    "Graça e paz Célula Gênesis! 🙌🏽",
    `Segue nossa escala do lanche *MÊS DE ${monthName.toLocaleUpperCase("pt-BR")}* 🌭🍿🍔`,
    "",
  ];

  organizations.forEach((organization, index) => {
    const [, month, day] = organization.dateIso.split("-");
    lines.push(`➡️ *${day}.${month}:*`);

    if (organization.type === "peopleRotation") {
      organization.participants.forEach((participant) => {
        const person = personById.get(participant.personId);
        if (person) lines.push(`${person.name}${participant.isResponsible ? " (responsável)" : ""}`);
      });
    } else {
      const purpose = organization.purpose.charAt(0).toLocaleLowerCase("pt-BR") + organization.purpose.slice(1);
      lines.push(
        `Contamos com a contribuição de *${organization.collectiveParticipation ? "todos" : "participantes"}*, para ${purpose}:`,
        `*${organization.amountPerPerson}* por pessoa. 🎂`,
      );
    }

    if (index < organizations.length - 1) lines.push("");
  });

  return lines.join("\n");
}

function PersonSelector({ id, label, people, onClose, onSelect }: {
  id: string;
  label: string;
  people: readonly SnackPerson[];
  onClose: () => void;
  onSelect: (personId: string) => void;
}) {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLocaleLowerCase("pt-BR");
  const results = people.filter((person) => person.name.toLocaleLowerCase("pt-BR").includes(normalizedQuery));

  return (
    <div className={styles.snackPersonSelector} id={id}>
      <label htmlFor={`${id}-search`}>{label}</label>
      <input
        autoFocus
        id={`${id}-search`}
        type="search"
        placeholder="Buscar por nome"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Escape") onClose();
          if (event.key === "Enter" && results[0]) {
            event.preventDefault();
            onSelect(results[0].id);
          }
        }}
      />
      <ul aria-label="Pessoas encontradas">
        {results.map((person) => <li key={person.id}><button type="button" onClick={() => onSelect(person.id)}>{person.name}</button></li>)}
        {results.length === 0 ? <li className={styles.snackNoResults}>Nenhuma pessoa encontrada</li> : null}
      </ul>
      <button className={styles.snackSelectorClose} type="button" onClick={onClose}>Fechar busca</button>
    </div>
  );
}

function PeopleRotationEditor({ draft, people, onCancel, onChange, onSave }: {
  draft: Extract<EditableSnackOrganization, { type: "peopleRotation" }>;
  people: readonly SnackPerson[];
  onCancel: () => void;
  onChange: (draft: Extract<EditableSnackOrganization, { type: "peopleRotation" }>) => void;
  onSave: () => void;
}) {
  const [selector, setSelector] = useState<"responsible" | "participant" | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const personById = useMemo(() => new Map(people.map((person) => [person.id, person])), [people]);
  const responsibleParticipants = draft.participants.filter((participant) => participant.isResponsible);
  const selectedIds = new Set(draft.participants.map((participant) => participant.personId));
  const responsibleCandidates = draft.participants
    .filter((participant) => !participant.isResponsible)
    .map((participant) => personById.get(participant.personId))
    .filter((person): person is SnackPerson => Boolean(person));
  const participantCandidates = people.filter((person) => !selectedIds.has(person.id));

  useEffect(() => {
    function closeTransientUi(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelector(null);
        setOpenMenuId(null);
      }
    }
    document.addEventListener("keydown", closeTransientUi);
    return () => document.removeEventListener("keydown", closeTransientUi);
  }, []);

  function setResponsibility(personId: string, isResponsible: boolean) {
    onChange({
      ...draft,
      participants: draft.participants.map((participant) => participant.personId === personId ? { ...participant, isResponsible } : participant),
    });
    setOpenMenuId(null);
  }

  function removeParticipant(personId: string) {
    onChange({ ...draft, participants: draft.participants.filter((participant) => participant.personId !== personId) });
    setOpenMenuId(null);
  }

  return (
    <>
      <section className={styles.snackEditorSection} aria-labelledby={`responsible-${draft.encounterId}`}>
        <h3 id={`responsible-${draft.encounterId}`}>Responsáveis</h3>
        {responsibleParticipants.length > 0 ? (
          <ul className={styles.snackResponsiblePeople}>
            {responsibleParticipants.map((participant) => {
              const person = personById.get(participant.personId);
              return person ? (
                <li key={participant.personId}>
                  <span>{person.name}</span>
                  <button type="button" aria-label={`Retirar responsabilidade de ${person.name}`} title="Retirar responsabilidade" onClick={() => setResponsibility(person.id, false)}>×</button>
                </li>
              ) : null;
            })}
          </ul>
        ) : <p className={styles.snackEditorEmpty}>Nenhum responsável definido.</p>}
        <ActionButton type="button" variant="secondary" className={styles.snackEditorSecondaryAction} aria-expanded={selector === "responsible"} aria-controls={`responsible-selector-${draft.encounterId}`} onClick={() => setSelector((current) => current === "responsible" ? null : "responsible")}>+ Definir responsável</ActionButton>
        {selector === "responsible" ? (
          <PersonSelector
            id={`responsible-selector-${draft.encounterId}`}
            label="Buscar entre participantes"
            people={responsibleCandidates}
            onClose={() => setSelector(null)}
            onSelect={(personId) => { setResponsibility(personId, true); setSelector(null); }}
          />
        ) : null}
      </section>

      <section className={styles.snackEditorSection} aria-labelledby={`participants-${draft.encounterId}`}>
        <div className={styles.snackEditorHeading}>
          <h3 id={`participants-${draft.encounterId}`}>Pessoas desta confraternização</h3>
          <span>{draft.participants.length} {draft.participants.length === 1 ? "pessoa" : "pessoas"}</span>
        </div>
        <ul className={styles.snackParticipantList}>
          {draft.participants.map((participant) => {
            const person = personById.get(participant.personId);
            if (!person) return null;
            const menuId = `participant-menu-${draft.encounterId}-${person.id}`;
            return (
              <li key={participant.personId}>
                <div><strong>{person.name}</strong>{participant.isResponsible ? <span>Responsável</span> : null}</div>
                <button className={styles.snackPersonMenuButton} type="button" aria-label={`Ações para ${person.name}`} aria-haspopup="menu" aria-expanded={openMenuId === person.id} aria-controls={menuId} onClick={() => setOpenMenuId((current) => current === person.id ? null : person.id)}>•••</button>
                {openMenuId === person.id ? (
                  <div className={styles.snackPersonMenu} id={menuId} role="menu" onKeyDown={(event) => {
                    const items = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="menuitem"]'));
                    const index = items.indexOf(document.activeElement as HTMLButtonElement);
                    if (event.key === "ArrowDown") { event.preventDefault(); items[(index + 1) % items.length]?.focus(); }
                    if (event.key === "ArrowUp") { event.preventDefault(); items[(index - 1 + items.length) % items.length]?.focus(); }
                    if (event.key === "Escape") { event.preventDefault(); setOpenMenuId(null); }
                  }}>
                    <button autoFocus type="button" role="menuitem" onClick={() => setResponsibility(person.id, !participant.isResponsible)}>{participant.isResponsible ? "Retirar responsabilidade" : "Tornar responsável"}</button>
                    <button className={styles.snackDestructiveAction} type="button" role="menuitem" onClick={() => removeParticipant(person.id)}>Remover da confraternização</button>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
        <ActionButton type="button" variant="secondary" className={styles.snackEditorSecondaryAction} aria-expanded={selector === "participant"} aria-controls={`participant-selector-${draft.encounterId}`} onClick={() => setSelector((current) => current === "participant" ? null : "participant")}>+ Adicionar pessoa</ActionButton>
        {selector === "participant" ? (
          <PersonSelector
            id={`participant-selector-${draft.encounterId}`}
            label="Buscar pessoas da célula"
            people={participantCandidates}
            onClose={() => setSelector(null)}
            onSelect={(personId) => {
              if (!selectedIds.has(personId)) onChange({ ...draft, participants: [...draft.participants, { personId, isResponsible: false }] });
              setSelector(null);
            }}
          />
        ) : null}
      </section>

      <div className={styles.snackEditorActions}>
        <ActionButton type="button" variant="secondary" onClick={onCancel}>Cancelar</ActionButton>
        <ActionButton type="button" variant="primary" onClick={onSave} disabled={draft.participants.length === 0}>Salvar alterações</ActionButton>
      </div>
    </>
  );
}

export function SnackOrganizationEditor({ cellSchedule, encounters, initialOrganizations, people }: {
  cellSchedule: CellMeetingSchedule;
  encounters: readonly PlanningEncounter[];
  initialOrganizations: readonly SnackOrganization[];
  people: readonly SnackPerson[];
}) {
  const [organizations, setOrganizations] = useState(() => copyOrganizations(initialOrganizations));
  const [preparedMonths, setPreparedMonths] = useState<Record<string, readonly SnackPlanningOccurrence[]>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftOrganization, setDraftOrganization] = useState<EditableSnackOrganization | null>(null);
  const [copyState, setCopyState] = useState<"idle" | "success" | "error">("idle");
  const [saveFeedback, setSaveFeedback] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();
    return { month: today.getMonth(), year: today.getFullYear() };
  });
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const today = useMemo(() => new Date(), []);
  const personById = useMemo(() => new Map(people.map((person) => [person.id, person])), [people]);
  const monthKey = `${selectedMonth.year}-${String(selectedMonth.month + 1).padStart(2, "0")}`;
  const displayedOrganizations = useMemo(
    () => organizations.filter((organization) => organization.dateIso.startsWith(monthKey)),
    [monthKey, organizations],
  );
  const copyableOrganizations = useMemo(
    () => displayedOrganizations.filter(isOrganizationFilled),
    [displayedOrganizations],
  );
  const monthRelation = getMonthRelation(selectedMonth, today);
  const projectedOccurrences = useMemo(
    () => getSnackPlanningOccurrences(selectedMonth, cellSchedule, encounters),
    [cellSchedule, encounters, selectedMonth],
  );
  const eligibleOccurrences = useMemo(
    () => monthRelation === "current"
      ? projectedOccurrences.filter((occurrence) => isOccurrenceEligible(occurrence, today))
      : monthRelation === "future" ? projectedOccurrences : [],
    [monthRelation, projectedOccurrences, today],
  );
  const monthLabel = useMemo(() => {
    const label = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" })
      .format(new Date(selectedMonth.year, selectedMonth.month, 1));
    return label.charAt(0).toLocaleUpperCase("pt-BR") + label.slice(1);
  }, [selectedMonth]);
  const monthName = useMemo(() => new Intl.DateTimeFormat("pt-BR", { month: "long" })
    .format(new Date(selectedMonth.year, selectedMonth.month, 1)), [selectedMonth]);
  const isPreparedMonth = displayedOrganizations.length > 0 || Object.hasOwn(preparedMonths, monthKey);
  const displayEntries = useMemo(() => {
    const occurrences = Object.hasOwn(preparedMonths, monthKey) ? preparedMonths[monthKey] : eligibleOccurrences;
    const entries: { encounter: PlanningEncounter; organization?: EditableSnackOrganization }[] = displayedOrganizations.map((organization) => ({
      encounter: { id: organization.encounterId, dateIso: organization.dateIso, startTime: organization.startTime },
      organization,
    }));

    occurrences.forEach((occurrence) => {
      const existingIndex = entries.findIndex(({ encounter }) =>
        encounter.id === occurrence.id || encounter.dateIso === occurrence.dateIso);
      if (existingIndex < 0) entries.push({ encounter: occurrence, organization: undefined });
    });

    return entries.toSorted((first, second) => first.encounter.dateIso.localeCompare(second.encounter.dateIso));
  }, [displayedOrganizations, eligibleOccurrences, monthKey, preparedMonths]);
  const monthlyMessage = useMemo(
    () => copyableOrganizations.length > 0 ? buildMonthlyMessage(copyableOrganizations, people, monthName) : "",
    [copyableOrganizations, monthName, people],
  );
  const canCreateMonth = monthRelation !== "past" && eligibleOccurrences.length > 0;
  const emptyState = monthRelation === "past"
    ? {
        title: "Nenhuma organização registrada",
        description: "Não há organização de lanche registrada para este mês.",
      }
    : monthRelation === "current" && eligibleOccurrences.length === 0
      ? {
          title: "Nenhuma organização registrada",
          description: "Não há mais encontros deste mês disponíveis para organização.",
        }
      : monthRelation === "current"
        ? {
            title: "Organize o lanche deste mês",
            description: "Ainda há encontros deste mês que podem ser organizados.",
          }
        : {
            title: "Organize o lanche deste mês",
            description: "Prepare com antecedência a organização dos próximos encontros.",
          };

  useEffect(() => () => {
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
  }, []);

  function startEditing(organization: EditableSnackOrganization) {
    if (editingId) return;
    setEditingId(organization.encounterId);
    setDraftOrganization(copyOrganization(organization));
    setSaveFeedback("");
  }

  function startPlanning(encounter: PlanningEncounter) {
    if (editingId) return;
    setEditingId(encounter.id);
    setDraftOrganization({
      encounterId: encounter.id,
      dateIso: encounter.dateIso,
      startTime: encounter.startTime,
      type: "peopleRotation",
      participants: [],
    });
    setSaveFeedback("");
  }

  function cancelEditing() {
    setEditingId(null);
    setDraftOrganization(null);
  }

  function saveEditing() {
    if (!draftOrganization) return;
    setOrganizations((current) => {
      const savedOrganization = copyOrganization(draftOrganization);
      const alreadyExists = current.some((organization) => organization.encounterId === draftOrganization.encounterId);
      const next = alreadyExists
        ? current.map((organization) => organization.encounterId === draftOrganization.encounterId ? savedOrganization : organization)
        : [...current, savedOrganization];
      return next.toSorted((a, b) => a.dateIso.localeCompare(b.dateIso));
    });
    setEditingId(null);
    setDraftOrganization(null);
    setSaveFeedback("✓ Alterações salvas.");
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    feedbackTimer.current = setTimeout(() => {
      setSaveFeedback("");
      feedbackTimer.current = null;
    }, 2500);
  }

  function createMonthPlan() {
    setPreparedMonths((current) => ({
      ...current,
      [monthKey]: eligibleOccurrences,
    }));
    setSaveFeedback("");
  }

  function navigateMonth(offset: number) {
    setSelectedMonth((current) => {
      const next = new Date(current.year, current.month + offset, 1);
      return { month: next.getMonth(), year: next.getFullYear() };
    });
    setEditingId(null);
    setDraftOrganization(null);
    setCopyState("idle");
    setSaveFeedback("");
  }

  async function copyMonth() {
    if (!monthlyMessage) return;

    try {
      await navigator.clipboard.writeText(monthlyMessage);
      if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
      setCopyState("success");
      feedbackTimer.current = setTimeout(() => {
        setCopyState("idle");
        feedbackTimer.current = null;
      }, 2000);
    } catch {
      setCopyState("error");
    }
  }

  return (
    <section className={styles.snackSection} aria-labelledby="snack-label">
      <SectionLabel id="snack-label">Organização do lanche</SectionLabel>

      <div className={styles.snackMonthToolbar}>
        <nav className={styles.monthNavigation} aria-label="Navegação entre meses">
          <button type="button" aria-label="Mês anterior" onClick={() => navigateMonth(-1)}>‹</button>
          <strong><time dateTime={monthKey} aria-live="polite">{monthLabel}</time></strong>
          <button type="button" aria-label="Próximo mês" onClick={() => navigateMonth(1)}>›</button>
        </nav>
        {copyableOrganizations.length > 0 ? <div className={styles.snackPrimaryAction}>
          <ActionButton type="button" variant="primary" className={copyState === "success" ? styles.copyButtonSuccess : ""} onClick={copyMonth}>
            {copyState === "success" ? "✓ Texto copiado" : "Copiar escala do mês"}
          </ActionButton>
          <p className={`${styles.copyFeedback} ${copyState === "success" ? styles.copyFeedbackSuccess : ""}`} role="status" aria-live="polite">
            {copyState === "success" ? "✓ Escala do mês copiada." : copyState === "error" ? "Não foi possível copiar a escala do mês." : ""}
          </p>
        </div> : null}
      </div>

      <article className={`${styles.card} ${styles.snackCard}`}>
        {isPreparedMonth ? <ol className={styles.snackMeetingList}>
          {displayEntries.map(({ encounter, organization }) => {
            const date = formatDateParts(encounter.dateIso);
            const isEditing = editingId === encounter.id;
            const editorOrganization = isEditing && draftOrganization?.encounterId === encounter.id ? draftOrganization : null;

            return (
              <li key={encounter.id} className={styles.snackMeeting}>
                <div className={styles.snackMeetingDate} aria-label={`${date.day} de ${date.monthLong}`}><strong>{date.day}</strong><span>{date.month}</span></div>
                <div className={styles.snackMeetingContent}>
                  {!organization ? (
                    <>
                      <p className={styles.snackMeetingMeta}>{formatWeekday(encounter.dateIso)} · {encounter.startTime}</p>
                      <strong className={styles.snackUndefined}>Organização ainda não definida</strong>
                    </>
                  ) : organization.type === "peopleRotation" ? (
                    <>
                      <p className={styles.snackMeetingMeta}>
                        <span>{formatWeekday(organization.dateIso)} · {organization.startTime}</span>
                      </p>
                      <div className={styles.snackResponsibleGroup}>
                        <strong>{formatNames(organization.participants.filter((participant) => participant.isResponsible).map((participant) => personById.get(participant.personId)?.name).filter((name): name is string => Boolean(name)))}</strong>
                        <span>Responsáveis</span>
                      </div>
                      <p className={styles.snackParticipants}>
                        {formatNames(organization.participants.filter((participant) => !participant.isResponsible).map((participant) => personById.get(participant.personId)?.name).filter((name): name is string => Boolean(name)))}
                      </p>
                    </>
                  ) : (
                    <>
                      <ContextTag>Contribuição coletiva</ContextTag>
                      <h3>{organization.purpose}</h3>
                      <strong className={styles.snackAmount}>{organization.amountPerPerson} por pessoa</strong>
                      <p className={styles.snackMeetingMeta}>{organization.collectiveParticipation ? "Participação de todos" : "Participação definida pela organização"}</p>
                    </>
                  )}
                </div>
                {!isEditing ? organization
                  ? <ActionButton className={styles.editOrganizationButton} type="button" variant="secondary" aria-expanded={false} aria-controls={`snack-editor-${encounter.id}`} disabled={editingId !== null} onClick={() => startEditing(organization)}>Editar organização</ActionButton>
                  : <ActionButton className={styles.editOrganizationButton} type="button" variant="secondary" aria-expanded={false} aria-controls={`snack-editor-${encounter.id}`} disabled={editingId !== null} onClick={() => startPlanning(encounter)}>Organizar</ActionButton>
                : null}

                {editorOrganization ? (
                  <form className={styles.snackEditor} id={`snack-editor-${encounter.id}`} onSubmit={(event) => event.preventDefault()}>
                    {editorOrganization.type === "peopleRotation" ? (
                      <PeopleRotationEditor draft={editorOrganization} people={people} onChange={setDraftOrganization} onCancel={cancelEditing} onSave={saveEditing} />
                    ) : (
                      <>
                      <div className={styles.collectiveFields}>
                        <label><span>Finalidade</span><input value={editorOrganization.purpose} onChange={(event) => setDraftOrganization({ ...editorOrganization, purpose: event.target.value })} /></label>
                        <label><span>Valor por pessoa</span><input value={editorOrganization.amountPerPerson} onChange={(event) => setDraftOrganization({ ...editorOrganization, amountPerPerson: event.target.value })} /></label>
                        <label className={styles.collectiveCheck}><input type="checkbox" checked={editorOrganization.collectiveParticipation} onChange={(event) => setDraftOrganization({ ...editorOrganization, collectiveParticipation: event.target.checked })} /> Participação coletiva</label>
                      </div>
                      <div className={styles.snackEditorActions}>
                        <ActionButton type="button" variant="secondary" onClick={cancelEditing}>Cancelar</ActionButton>
                        <ActionButton type="button" variant="primary" onClick={saveEditing}>Salvar alterações</ActionButton>
                      </div>
                      </>
                    )}
                  </form>
                ) : null}
              </li>
            );
          })}
        </ol> : (
          <div className={styles.snackPlanningEmpty}>
            <h2>{emptyState.title}</h2>
            <p>{emptyState.description}</p>
            {canCreateMonth ? <ActionButton type="button" variant="primary" onClick={createMonthPlan}>+ Criar organização do mês</ActionButton> : null}
          </div>
        )}

        <p className={styles.snackSaveFeedback} role="status" aria-live="polite">{saveFeedback}</p>
        {copyableOrganizations.length > 0 ? <details className={styles.snackPreview}>
          <summary>Visualizar mensagem do mês</summary>
          <div className={styles.snackPreviewContent}>{monthlyMessage}</div>
        </details> : null}
      </article>
    </section>
  );
}
