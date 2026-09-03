"use client";

import { FormEvent, useMemo, useState } from "react";
import { ActionButton } from "@/components/portal-shell";
import { ContextTag, SectionLabel } from "@/components/portal-patterns";
import { deriveAttendanceSummary, type AttendancePerson, type AttendanceState, type EncounterAttendance } from "@/data/secretariat-attendance";
import styles from "../../../secretaria.module.css";

function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\D/g, "").toLocaleLowerCase("pt-BR");
}

function normalizeName(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().replace(/\s+/g, " ").toLocaleLowerCase("pt-BR");
}

function personDescription(person: AttendancePerson) {
  return person.cellRoles.length > 0 ? person.cellRoles.join(" · ") : person.churchRelationshipLabel;
}

export function AttendanceRegister({ initialPeople, initialRecords }: {
  initialPeople: readonly AttendancePerson[];
  initialRecords: readonly EncounterAttendance[];
}) {
  const [people, setPeople] = useState<AttendancePerson[]>([...initialPeople]);
  const [records, setRecords] = useState<EncounterAttendance[]>([...initialRecords]);
  const [showVisitorForm, setShowVisitorForm] = useState(false);
  const [visitorName, setVisitorName] = useState("");
  const [visitorWhatsapp, setVisitorWhatsapp] = useState("");
  const [invitedByPersonId, setInvitedByPersonId] = useState("");
  const [inviterQuery, setInviterQuery] = useState("");
  const [inviterOpen, setInviterOpen] = useState(false);
  const [activeInviterIndex, setActiveInviterIndex] = useState(-1);
  const [ignoreCandidate, setIgnoreCandidate] = useState(false);
  const [feedback, setFeedback] = useState("");

  const sortedPeople = useMemo(
    () => [...people].sort((first, second) => first.name.localeCompare(second.name, "pt-BR", { sensitivity: "base" })),
    [people],
  );
  const recordByPersonId = useMemo(() => new Map(records.map((record) => [record.personId, record])), [records]);
  const totals = useMemo(() => {
    const summary = deriveAttendanceSummary(people, records);
    return { ...summary, visitors: summary.visitors.length };
  }, [people, records]);
  const candidate = useMemo(() => {
    if (ignoreCandidate || (!visitorName.trim() && !visitorWhatsapp.trim())) return undefined;
    const normalizedName = normalizeName(visitorName);
    const normalizedWhatsapp = normalize(visitorWhatsapp);
    return people.find((person) =>
      (normalizedName.length > 2 && normalizeName(person.name) === normalizedName)
      || (normalizedWhatsapp.length > 5 && person.whatsapp && normalize(person.whatsapp) === normalizedWhatsapp),
    );
  }, [ignoreCandidate, people, visitorName, visitorWhatsapp]);
  const filteredInviters = useMemo(() => {
    const query = normalizeName(inviterQuery);
    return query
      ? sortedPeople.filter((person) => normalizeName(person.name).includes(query))
      : sortedPeople;
  }, [inviterQuery, sortedPeople]);

  function setAttendance(personId: string, state: AttendanceState) {
    setRecords((current) => {
      const existing = current.find((record) => record.personId === personId);
      if (!existing) return [...current, { personId, state }];
      return current.map((record) => record.personId === personId ? { ...record, state } : record);
    });
    setFeedback("");
  }

  function resetVisitorForm() {
    setVisitorName("");
    setVisitorWhatsapp("");
    setInvitedByPersonId("");
    setInviterQuery("");
    setInviterOpen(false);
    setActiveInviterIndex(-1);
    setIgnoreCandidate(false);
    setShowVisitorForm(false);
  }

  function selectInviter(person?: AttendancePerson) {
    setInvitedByPersonId(person?.id ?? "");
    setInviterQuery(person?.name ?? "");
    setInviterOpen(false);
    setActiveInviterIndex(-1);
  }

  function handleInviterKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      setInviterOpen(false);
      setActiveInviterIndex(-1);
      return;
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setInviterOpen(true);
      const direction = event.key === "ArrowDown" ? 1 : -1;
      setActiveInviterIndex((current) => {
        if (filteredInviters.length === 0) return -1;
        if (current < 0) return direction > 0 ? 0 : filteredInviters.length - 1;
        return (current + direction + filteredInviters.length) % filteredInviters.length;
      });
      return;
    }
    if (event.key === "Enter" && inviterOpen && activeInviterIndex >= 0) {
      event.preventDefault();
      selectInviter(filteredInviters[activeInviterIndex]);
    }
  }

  function associateExistingPerson(person: AttendancePerson) {
    setRecords((current) => {
      const relation = { personId: person.id, state: "present" as const, ...(invitedByPersonId ? { invitedByPersonId } : {}) };
      return current.some((record) => record.personId === person.id)
        ? current.map((record) => record.personId === person.id ? { ...record, ...relation } : record)
        : [...current, relation];
    });
    resetVisitorForm();
    setFeedback(`Presença de ${person.name} registrada neste encontro.`);
  }

  function addVisitor(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!visitorName.trim() || (candidate && !ignoreCandidate)) return;
    const personId = `person-local-${Date.now()}`;
    const newPerson: AttendancePerson = {
      id: personId,
      name: visitorName.trim(),
      churchRelationship: "Visitante",
      churchRelationshipLabel: "Visitante",
      cellRoles: [],
      ...(visitorWhatsapp.trim() ? { whatsapp: visitorWhatsapp.trim() } : {}),
    };
    setPeople((current) => [...current, newPerson]);
    setRecords((current) => [...current, {
      personId,
      state: "present",
      ...(invitedByPersonId ? { invitedByPersonId } : {}),
    }]);
    resetVisitorForm();
    setFeedback(`${newPerson.name}: vínculo Visitante e presença registrados.`);
  }

  return (
    <section className={styles.attendanceSection} aria-labelledby="attendance-label">
      <SectionLabel id="attendance-label">Registro de presença</SectionLabel>
      <article className={`${styles.card} ${styles.attendanceCard}`}>
        <ContextTag>Após o encontro</ContextTag>
        <p className={styles.attendanceIntro}>Registre quem participou do encontro e identifique os visitantes.</p>

        <dl className={styles.attendanceSummary} aria-label="Resumo da presença">
          <div><dt>Presentes</dt><dd>{totals.knownPresent}</dd></div>
          <div><dt>Ausentes</dt><dd>{totals.absent}</dd></div>
          <div><dt>Visitantes</dt><dd>{totals.visitors}</dd></div>
          <div><dt>Total</dt><dd>{totals.totalPresent} <span>presentes</span></dd></div>
        </dl>

        <div className={styles.attendanceToolbar}>
          <h3>Pessoas da Gênesis</h3>
          <button className={styles.addVisitorButton} type="button" onClick={() => { setShowVisitorForm((current) => !current); setFeedback(""); }} aria-expanded={showVisitorForm}>
            + Adicionar visitante
          </button>
        </div>

        {showVisitorForm ? (
          <form className={styles.visitorForm} onSubmit={addVisitor}>
            <div className={styles.visitorFields}>
              <label><span>Nome *</span><input required value={visitorName} onChange={(event) => { setVisitorName(event.target.value); setIgnoreCandidate(false); }} /></label>
              <label><span>WhatsApp</span><input type="tel" value={visitorWhatsapp} onChange={(event) => { setVisitorWhatsapp(event.target.value); setIgnoreCandidate(false); }} /></label>
              <div className={styles.inviterField} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setInviterOpen(false); }}>
                <label htmlFor="inviter-search">Quem convidou?</label>
                <div className={styles.comboboxControl}>
                  <input
                    id="inviter-search"
                    role="combobox"
                    aria-autocomplete="list"
                    aria-expanded={inviterOpen}
                    aria-controls="inviter-options"
                    aria-activedescendant={activeInviterIndex >= 0 ? `inviter-option-${filteredInviters[activeInviterIndex]?.id}` : undefined}
                    placeholder="Não informado"
                    value={inviterQuery}
                    onFocus={() => setInviterOpen(true)}
                    onChange={(event) => { setInviterQuery(event.target.value); setInvitedByPersonId(""); setInviterOpen(true); setActiveInviterIndex(-1); }}
                    onKeyDown={handleInviterKeyDown}
                  />
                  <button type="button" aria-label={inviterOpen ? "Fechar opções" : "Abrir opções"} onClick={() => setInviterOpen((current) => !current)}>
                    <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m5 7.5 5 5 5-5" /></svg>
                  </button>
                </div>
                {inviterOpen ? (
                  <ul className={styles.comboboxOptions} id="inviter-options" role="listbox" aria-label="Pessoas que podem ter convidado">
                    <li role="option" aria-selected={!invitedByPersonId}><button type="button" onClick={() => selectInviter()}>Não informado</button></li>
                    {filteredInviters.map((person, index) => (
                      <li key={person.id} id={`inviter-option-${person.id}`} role="option" aria-selected={invitedByPersonId === person.id || activeInviterIndex === index}>
                        <button type="button" onClick={() => selectInviter(person)}>{person.name}</button>
                      </li>
                    ))}
                    {filteredInviters.length === 0 ? <li className={styles.noComboboxResults}>Nenhuma pessoa encontrada</li> : null}
                  </ul>
                ) : null}
              </div>
            </div>
            {candidate ? (
              <div className={styles.possibleMatch} role="status">
                <strong>Encontramos uma pessoa que pode ser a mesma.</strong>
                <span>{candidate.name}{candidate.whatsapp ? ` · ${candidate.whatsapp}` : ""}</span>
                <div>
                  <button type="button" onClick={() => associateExistingPerson(candidate)}>Usar esta pessoa</button>
                  <button type="button" onClick={() => setIgnoreCandidate(true)}>É outra pessoa</button>
                </div>
              </div>
            ) : null}
            <div className={styles.visitorActions}>
              <ActionButton type="submit" variant="secondary" disabled={Boolean(candidate && !ignoreCandidate)}>Adicionar e marcar presente</ActionButton>
              <button type="button" onClick={resetVisitorForm}>Cancelar</button>
            </div>
          </form>
        ) : null}

        <ul className={styles.attendanceList}>
          {sortedPeople.map((person) => {
            const state = recordByPersonId.get(person.id)?.state ?? "unregistered";
            return (
              <li key={person.id}>
                <div className={styles.attendancePerson}><strong>{person.name}</strong><span>{personDescription(person)}</span>{state === "unregistered" ? <small>Não registrado</small> : null}</div>
                <fieldset className={styles.attendanceChoice}>
                  <legend>Presença de {person.name}</legend>
                  <label className={state === "present" ? styles.presentSelected : undefined}><input type="radio" name={`attendance-${person.id}`} checked={state === "present"} onChange={() => setAttendance(person.id, "present")} /><span>Presente</span></label>
                  <label className={state === "absent" ? styles.absentSelected : undefined}><input type="radio" name={`attendance-${person.id}`} checked={state === "absent"} onChange={() => setAttendance(person.id, "absent")} /><span>Ausente</span></label>
                </fieldset>
              </li>
            );
          })}
        </ul>

        <div className={styles.attendanceSave}>
          <ActionButton type="button" variant="primary" onClick={() => setFeedback("Presença salva.")}>Salvar presença</ActionButton>
          <p role="status" aria-live="polite">{feedback}</p>
        </div>
      </article>
    </section>
  );
}
