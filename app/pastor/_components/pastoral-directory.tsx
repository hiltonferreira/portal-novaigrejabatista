import Link from "next/link";
import { ContextTag, SectionBlock, StatusTag, type StatusTone } from "@/components/portal-patterns";
import { getPastoralCell, getPastoralPerson, pastoralCellsMock, pastoralCoordinationsMock, pastoralMultiplicationsMock, pastoralSupervisionsMock } from "@/data/pastoral-structure";
import styles from "../pastor.module.css";
import { PastoralCellsNavigation } from "./pastoral-cells-navigation";

type DirectoryKind = "cells" | "supervisions" | "coordinations" | "multiplications" | "trainees";
const cellTone: Record<string, StatusTone> = { "Em implantação": "progress", Ativa: "success", Inativa: "neutral" };

export function PastoralDirectory({ kind }: { kind: DirectoryKind }) {
  const content = {
    cells: { hat: "Células", tag: "Estrutura de liderança", body: <ul className={styles.directoryList}>{pastoralCellsMock.map((cell) => <li key={cell.id}><div><h2>{cell.name}</h2><p><strong>{getPastoralPerson(cell.leaderId)?.name} · Líder</strong>{cell.traineeLeaderIds.map((id) => <span key={id}>{getPastoralPerson(id)?.name} · Líder em Treinamento</span>)}<span>{cell.weekday[0].toLocaleUpperCase("pt-BR") + cell.weekday.slice(1)} · {cell.startTime}</span></p></div><StatusTag tone={cellTone[cell.status]}>{cell.status}</StatusTag></li>)}</ul> },
    supervisions: { hat: "Supervisão", tag: "Lideranças supervisionadas", body: <ul className={styles.directoryList}>{pastoralSupervisionsMock.map((item) => <li key={item.id}><div><h2>{getPastoralPerson(item.supervisorId)?.name}</h2><p><span>Lidera a célula {getPastoralCell(item.ledCellId)?.name}</span><strong>Líderes acompanhados</strong>{item.supervisedLeaderIds.map((id) => { const person = getPastoralPerson(id); const cell = pastoralCellsMock.find((candidate) => candidate.leaderId === id); return <span key={id}>{person?.name} · {cell?.name}</span>; })}</p></div></li>)}</ul> },
    coordinations: { hat: "Coordenação", tag: "Estrutura pastoral", body: <ul className={styles.directoryList}>{pastoralCoordinationsMock.map((item) => <li key={item.id}><div><h2>{item.name}</h2><p><strong>{getPastoralPerson(item.coordinatorId)?.name} · Coordenador</strong><span>Supervisores</span>{item.supervisionIds.map((id) => { const supervision = pastoralSupervisionsMock.find((candidate) => candidate.id === id); return <span key={id}>{supervision ? getPastoralPerson(supervision.supervisorId)?.name : null}</span>; })}</p></div></li>)}</ul> },
    multiplications: { hat: "Multiplicações", tag: "Processos e eventos", body: <ul className={styles.directoryList}>{pastoralMultiplicationsMock.map((item) => <li key={item.id}><div><h2>{item.state}</h2><p>{"childCellId" in item ? <><strong>{getPastoralCell(item.parentCellId)?.name} → {getPastoralCell(item.childCellId)?.name}</strong><span>Efetivada em {new Intl.DateTimeFormat("pt-BR").format(new Date(`${item.occurredOn}T12:00:00`))}</span></> : <><strong>{item.description}</strong><span>Processo iniciado em {new Intl.DateTimeFormat("pt-BR").format(new Date(`${item.startedOn}T12:00:00`))}</span></>}</p></div></li>)}</ul> },
    trainees: { hat: "Líderes em Treinamento", tag: "Designação e desenvolvimento", body: <ul className={styles.directoryList}>{pastoralCellsMock.flatMap((cell) => cell.traineeLeaderIds.map((id) => <li key={`${cell.id}-${id}`}><div><h2>{getPastoralPerson(id)?.name}</h2><p><strong>Líder em Treinamento</strong><span>{cell.name}</span><span>Designação pastoral preservada; não há promoção automática.</span></p></div></li>))}</ul> },
  }[kind];

  return <div className={styles.directoryPage}>
    {kind !== "cells" ? <Link className={styles.backToOverview} href="/pastor">‹ Voltar para Visão Geral</Link> : null}
    {kind === "cells" ? <PastoralCellsNavigation /> : null}
    <SectionBlock id={`pastoral-${kind}`} label={content.hat}>
      <article className={`${styles.overviewCard} ${styles.directoryCard}`}><ContextTag>{content.tag}</ContextTag>{content.body}</article>
    </SectionBlock>
  </div>;
}
