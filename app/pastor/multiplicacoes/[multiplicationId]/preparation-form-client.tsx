"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ContextTag, StatusTag } from "@/components/portal-patterns";
import type { ChurchCell } from "@/data/cell";
import type { PastoralPerson } from "@/data/pastoral-structure";
import { readStoredPreparations, writeStoredPreparations, type StoredMultiplicationPreparation } from "@/lib/test-persistence";
import managementStyles from "./preparation.module.css";

type Participant = { name: string; churchRelationshipLabel: string; cellRoles?: readonly string[] };
type Props = { multiplicationId: string; initial?: StoredMultiplicationPreparation; cells: readonly ChurchCell[]; leaders: readonly PastoralPerson[]; genesisParticipants: readonly Participant[] };
const weekdays = ["segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira"] as const;
const dateFormatter = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric" });

export function PreparationFormClient({ multiplicationId, initial, cells, leaders, genesisParticipants }: Props) {
  const router = useRouter();
  const [record, setRecord] = useState<StoredMultiplicationPreparation | undefined>(initial);
  const [saved, setSaved] = useState(false);
  const [peopleOpen, setPeopleOpen] = useState(false);
  const isDraft = multiplicationId === "rascunho";

  useEffect(() => {
    const stored = readStoredPreparations().find((item) => item.id === multiplicationId);
    if (stored) setRecord(stored);
  }, [multiplicationId]);

  const parentCell = useMemo(() => cells.find((cell) => cell.id === record?.parentCellId), [cells, record?.parentCellId]);
  const peopleOptions = parentCell?.id === "cell-genesis" ? genesisParticipants : [];
  if (!record) return <section className={managementStyles.section}><p>Preparação não encontrada neste navegador.</p></section>;

  const currentRecord = record;
  function patch(values: Partial<StoredMultiplicationPreparation>) { setRecord((current) => current ? { ...current, ...values } : current); setSaved(false); }
  function togglePerson(name: string) { const current = currentRecord.people ?? []; patch({ people: current.includes(name) ? current.filter((item) => item !== name) : [...current, name] }); }
  function save() {
    const stored = readStoredPreparations();
    if (isDraft) {
      const created: StoredMultiplicationPreparation = { ...currentRecord, id: `multiplication-test-${Date.now()}` };
      writeStoredPreparations([...stored, created]);
      setRecord(created);
      setSaved(true);
      window.setTimeout(() => router.push("/pastor/multiplicacoes"), 500);
      return;
    }
    writeStoredPreparations([...stored.filter((item) => item.id !== currentRecord.id), currentRecord]);
    setSaved(true);
  }

  return <>
    <header className={managementStyles.heading}><div><p className={managementStyles.eyebrow}>{isDraft ? "Nova preparação" : "Preparação da multiplicação"}</p><h1>{parentCell?.name ?? "Célula de origem"}</h1><p>Organize os dados previstos para a futura célula sem alterar os vínculos atuais durante a preparação.</p></div><StatusTag tone="progress">{isDraft ? "Rascunho" : "Em preparação"}</StatusTag></header>
    <form className={managementStyles.form} onSubmit={(event) => { event.preventDefault(); save(); }}>
      <section className={managementStyles.section}><div className={managementStyles.sectionHeading}><ContextTag>Processo</ContextTag><h2>Dados da preparação</h2></div><div className={managementStyles.readonlyGrid}><div><span>Célula de origem</span><strong>{parentCell?.name ?? "Não registrada"}</strong></div><div><span>Processo iniciado</span><strong>{dateFormatter.format(new Date(`${currentRecord.startedOn}T12:00:00`))}</strong></div><div><span>Iniciado por</span><strong>{currentRecord.startedBy}</strong></div></div><div className={managementStyles.fieldsGrid}><label>Previsão da multiplicação<input type="date" value={currentRecord.expectedDate ?? ""} onChange={(event)=>patch({expectedDate:event.target.value})}/></label><label className={managementStyles.fullField}>Observação<textarea rows={4} value={currentRecord.notes ?? ""} onChange={(event)=>patch({notes:event.target.value})} placeholder="Registre informações relevantes para o acompanhamento pastoral."/></label></div></section>
      <section className={managementStyles.section}><div className={managementStyles.sectionHeading}><ContextTag>Futura célula</ContextTag><h2>Configuração prevista</h2><p>Estes dados descrevem a futura célula. Eles ainda não criam nem alteram uma célula ativa.</p></div><div className={managementStyles.fieldsGrid}><label>Nome futuro<input value={currentRecord.futureName ?? ""} onChange={(event)=>patch({futureName:event.target.value})}/></label><label>Futura liderança<select value={currentRecord.futureLeaderId ?? ""} onChange={(event)=>patch({futureLeaderId:event.target.value})}><option value="">Selecionar pessoa</option>{leaders.map((person)=><option value={person.id} key={person.id}>{person.name}</option>)}</select><small>A futura liderança deve ter a Jornada DNA concluída. O sistema não calcula prontidão.</small></label><label>Dia da semana<select value={currentRecord.weekday ?? ""} onChange={(event)=>patch({weekday:event.target.value})}><option value="">Selecionar dia</option>{weekdays.map((weekday)=><option value={weekday} key={weekday}>{weekday}</option>)}</select></label><label>Horário<div className={managementStyles.timeField}><input type="time" value={currentRecord.time ?? ""} onChange={(event)=>patch({time:event.target.value})}/></div></label><label>Local<input value={currentRecord.location ?? ""} onChange={(event)=>patch({location:event.target.value})}/></label><label>Anfitrião<input value={currentRecord.host ?? ""} onChange={(event)=>patch({host:event.target.value})}/></label></div></section>
      <section className={managementStyles.section}><div className={managementStyles.sectionHeading}><ContextTag>Pessoas previstas</ContextTag><h2>Composição prevista</h2><p>Durante a preparação, as pessoas selecionadas continuam vinculadas à célula de origem.</p></div><div className={managementStyles.peopleSelector}><div className={managementStyles.peopleSummary}><div><strong>{(currentRecord.people?.length ?? 0) ? `${currentRecord.people!.length} ${currentRecord.people!.length === 1 ? "pessoa selecionada" : "pessoas selecionadas"}` : "Nenhuma pessoa prevista registrada."}</strong><p>{peopleOptions.length ? `As pessoas selecionadas permanecem vinculadas à célula ${parentCell?.name} durante a preparação.` : "Ainda não há participantes demonstrativos cadastrados para esta célula."}</p></div><button className="action-link secondary" type="button" disabled={!peopleOptions.length} onClick={()=>setPeopleOpen((value)=>!value)}>{peopleOpen ? "Fechar seleção" : "Selecionar pessoas"}</button></div>{(currentRecord.people?.length ?? 0) > 0 && <div className={managementStyles.selectedPeople}>{currentRecord.people!.map((name)=><button key={name} type="button" onClick={()=>togglePerson(name)}>{name}<span>×</span></button>)}</div>}{peopleOpen && <div className={managementStyles.peopleOptions}>{peopleOptions.map((person)=><label key={person.name}><input type="checkbox" checked={(currentRecord.people ?? []).includes(person.name)} onChange={()=>togglePerson(person.name)}/><span><strong>{person.name}</strong><small>{person.churchRelationshipLabel}</small></span></label>)}</div>}</div></section>
      <div className={managementStyles.actions}><button className="action-link primary" type="submit">{isDraft ? "Iniciar preparação" : "Salvar alterações"}</button><p>{saved ? (isDraft ? "Preparação iniciada e salva neste navegador. Redirecionando…" : "Alterações salvas neste navegador para os testes.") : "As alterações permanecem locais até conectarmos a persistência definitiva."}</p></div>
    </form>
    {!isDraft && <section className={`${managementStyles.section} ${managementStyles.effectuation}`}><div className={managementStyles.sectionHeading}><ContextTag>Efetivação da multiplicação</ContextTag><h2>Concluir a preparação</h2><p>A efetivação da multiplicação continua separada do simples salvamento dos dados.</p></div><button className="action-link secondary" type="button">Efetivar multiplicação</button></section>}
  </>;
}
