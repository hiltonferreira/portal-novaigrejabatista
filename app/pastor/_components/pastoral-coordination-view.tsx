"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ContextTag } from "@/components/portal-patterns";
import { getPastoralCell, getPastoralPerson, pastoralCellsMock, pastoralCoordinationsMock, pastoralSupervisionsMock } from "@/data/pastoral-structure";
import styles from "../pastor.module.css";
import { TreeControls } from "./tree-controls";

type Selection = { kind: "coordinator" | "supervisor"; personId: string; coordinationId: string };

function ledCellFor(personId: string) { return pastoralCellsMock.find((cell) => cell.leaderId === personId); }
function supervisionsFor(coordinationId: string) {
  const coordination = pastoralCoordinationsMock.find((item) => item.id === coordinationId);
  return coordination?.supervisionIds.map((id) => pastoralSupervisionsMock.find((item) => item.id === id)).filter(Boolean) ?? [];
}
function relatedCellsForSupervision(supervision: (typeof pastoralSupervisionsMock)[number]) {
  const cellIds = [supervision.ledCellId, ...supervision.supervisedLeaderIds.map((id) => ledCellFor(id)?.id).filter(Boolean)];
  return Array.from(new Set(cellIds)).map((id) => getPastoralCell(id!)).filter(Boolean);
}

function CoordinationPanel({ selection }: { selection: Selection }) {
  const coordination = pastoralCoordinationsMock.find((item) => item.id === selection.coordinationId);
  if (!coordination) return null;
  const supervisions = supervisionsFor(coordination.id);
  const person = getPastoralPerson(selection.personId);
  const selectedSupervision = supervisions.find((item) => item?.supervisorId === selection.personId);
  const isCoordinator = selection.kind === "coordinator";
  const relatedCells = isCoordinator
    ? Array.from(new Map(supervisions.flatMap((item) => item ? relatedCellsForSupervision(item) : []).map((cell) => [cell!.id, cell])).values())
    : selectedSupervision ? relatedCellsForSupervision(selectedSupervision) : [];

  return <aside data-pastoral-structure="panel" className={styles.supervisionPanel} aria-live="polite" aria-label={`Contexto de ${person?.name ?? "coordenação"}`}>
    <div className={styles.panelIdentity}><h2>{person?.name}</h2><ContextTag>{isCoordinator ? "Coordenador" : "Supervisor"}</ContextTag></div>
    <dl className={styles.cellContextDetails}>
      {isCoordinator ? <>
        <div><dt>Supervisores acompanhados</dt><dd><span>{supervisions.length} {supervisions.length === 1 ? "supervisor" : "supervisores"}</span></dd></div>
        <div><dt>Supervisores</dt><dd>{supervisions.map((item) => <strong key={item!.id}>{getPastoralPerson(item!.supervisorId)?.name}</strong>)}</dd></div>
      </> : <div><dt>Coordenação atual</dt><dd><strong>{getPastoralPerson(coordination.coordinatorId)?.name}</strong><span>Coordenador</span></dd></div>}
      <div><dt>Células relacionadas</dt><dd>{relatedCells.map((cell) => <strong key={cell!.id}>{cell!.name}</strong>)}</dd></div>
    </dl>
  </aside>;
}

export function PastoralCoordinationView({ mode }: { mode: "list" | "structure" }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ x: number; y: number; left: number; top: number } | null>(null);
  const initial = pastoralCoordinationsMock[0];
  const [selection, setSelection] = useState<Selection | null>(initial ? { kind: "coordinator", personId: initial.coordinatorId, coordinationId: initial.id } : null);
  const [scale, setScale] = useState(1);
  const groups = useMemo(() => pastoralCoordinationsMock.map((coordination) => {
    const supervisors = supervisionsFor(coordination.id).map((supervision) => ({ supervision: supervision!, person: getPastoralPerson(supervision!.supervisorId), cell: getPastoralCell(supervision!.ledCellId) }));
    const relatedCells = Array.from(new Map(supervisors.flatMap(({ supervision }) => relatedCellsForSupervision(supervision)).map((cell) => [cell!.id, cell])).values());
    return { coordination, coordinator: getPastoralPerson(coordination.coordinatorId), supervisors, relatedCells };
  }), []);

  const fitStructure = useCallback(() => {
    const viewport = viewportRef.current;
    const forest = viewport?.querySelector<HTMLElement>(`.${styles.supervisionForest}`);
    if (!viewport || !forest) return;
    const availableWidth = viewport.clientWidth - (window.innerWidth < 720 ? 24 : 56);
    const availableHeight = viewport.clientHeight - (window.innerWidth < 720 ? 32 : 48);
    setScale(Math.max(window.innerWidth < 720 ? .85 : .72, Math.min(1.15, availableWidth / (forest.scrollWidth / scale), availableHeight / (forest.scrollHeight / scale))));
    window.setTimeout(() => viewport.scrollTo({ left: 0, top: 0, behavior: "smooth" }), 0);
  }, [scale]);

  useEffect(() => { if (mode !== "structure") return; const timer = window.setTimeout(fitStructure, 40); return () => window.clearTimeout(timer); }, [fitStructure, mode, selection]);

  if (!groups.length) return <div className={styles.supervisionEmpty}><ContextTag>Estrutura de acompanhamento</ContextTag><p>Nenhuma relação de coordenação está registrada.</p></div>;

  return <div data-pastoral-structure="workspace" data-has-panel={selection ? "true" : "false"} className={`${styles.supervisionWorkspace} ${selection ? styles.supervisionWorkspaceWithPanel : ""}`}>
    {mode === "list" ? <div className={styles.supervisionList}>{groups.map(({ coordination, coordinator, supervisors, relatedCells }) => (
      <button data-pastoral-structure="group" className={styles.supervisionGroup} key={coordination.id} type="button" aria-pressed={selection?.kind === "coordinator" && selection.coordinationId === coordination.id} onClick={() => setSelection({ kind: "coordinator", personId: coordination.coordinatorId, coordinationId: coordination.id })}>
        <span className={styles.supervisorIdentity}><strong data-pastoral-structure="person-name">{coordinator?.name}</strong><span>Coordenador</span></span>
        <span data-pastoral-structure="relationship-list" className={styles.supervisedLeaders}><span data-structure-label>Supervisores acompanhados</span>{supervisors.map(({ person, cell }) => <span data-pastoral-structure="relationship" className={styles.supervisedLeaderSummary} key={person!.id}><strong>{person?.name}</strong><small>Supervisor · {cell?.name}</small></span>)}</span>
        <span className={styles.supervisionLedCell}><span data-structure-label>Células relacionadas</span>{relatedCells.map((cell) => <strong key={cell!.id}>{cell?.name}</strong>)}</span>
      </button>
    ))}</div> : <div className={styles.supervisionStructureArea}>
      <TreeControls label="Controles da estrutura de coordenação" onZoomIn={() => setScale((value) => Math.min(1.4, value + .1))} onZoomOut={() => setScale((value) => Math.max(.65, value - .1))} onFit={fitStructure} />
      <div data-pastoral-structure="canvas" ref={viewportRef} className={styles.supervisionCanvas} aria-label="Estrutura atual de coordenação" onPointerDown={(event) => { if ((event.target as HTMLElement).closest("button")) return; const viewport = viewportRef.current; if (!viewport) return; dragRef.current = { x: event.clientX, y: event.clientY, left: viewport.scrollLeft, top: viewport.scrollTop }; viewport.setPointerCapture(event.pointerId); }} onPointerMove={(event) => { const drag = dragRef.current; const viewport = viewportRef.current; if (!drag || !viewport) return; viewport.scrollLeft = drag.left - (event.clientX - drag.x); viewport.scrollTop = drag.top - (event.clientY - drag.y); }} onPointerUp={() => { dragRef.current = null; }} onPointerCancel={() => { dragRef.current = null; }}>
        <div className={styles.supervisionForest} style={{ zoom: scale }}>{groups.map(({ coordination, coordinator, supervisors }) => <section className={`${styles.supervisionTreeGroup}${selection?.kind === "coordinator" && selection.coordinationId === coordination.id ? ` ${styles.supervisionTreeGroupSelected}` : ""}`} key={coordination.id} aria-label={`Acompanhamento de ${coordinator?.name}`}>
          <button data-pastoral-structure="node" className={styles.supervisorNode} type="button" aria-pressed={selection?.kind === "coordinator" && selection.coordinationId === coordination.id} onClick={() => setSelection({ kind: "coordinator", personId: coordination.coordinatorId, coordinationId: coordination.id })}><span className={styles.supervisionNodeHeader}><strong>{coordinator?.name}</strong><ContextTag>Coordenador</ContextTag></span><span className={styles.supervisionNodeCell}>{supervisors.length} {supervisors.length === 1 ? "supervisor acompanhado" : "supervisores acompanhados"}</span></button>
          <ul>{supervisors.map(({ supervision, person, cell }) => <li key={supervision.id}><button data-pastoral-structure="node" className={styles.leaderNode} type="button" aria-pressed={selection?.kind === "supervisor" && selection.personId === person?.id} onClick={() => setSelection({ kind: "supervisor", personId: person!.id, coordinationId: coordination.id })}><span className={styles.supervisionNodeHeader}><strong>{person?.name}</strong><ContextTag>Supervisor</ContextTag></span><span className={styles.supervisionNodeCell}>{cell?.name}</span></button></li>)}</ul>
        </section>)}</div>
      </div>
    </div>}
    {selection ? <CoordinationPanel selection={selection} /> : null}
  </div>;
}
