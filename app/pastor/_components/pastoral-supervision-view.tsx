"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ContextTag } from "@/components/portal-patterns";
import {
  getPastoralCell,
  getPastoralPerson,
  pastoralCellsMock,
  pastoralSupervisionsMock,
} from "@/data/pastoral-structure";
import styles from "../pastor.module.css";
import { TreeControls } from "./tree-controls";

type Selection = { kind: "supervisor" | "leader"; personId: string; supervisionId: string };

function ledCellFor(personId: string) {
  return pastoralCellsMock.find((cell) => cell.leaderId === personId);
}

function SupervisionPanel({ selection }: { selection: Selection }) {
  const supervision = pastoralSupervisionsMock.find((item) => item.id === selection.supervisionId);
  if (!supervision) return null;

  const person = getPastoralPerson(selection.personId);
  const cell = ledCellFor(selection.personId);
  const relatedCells = supervision.supervisedLeaderIds.map(ledCellFor).filter(Boolean);
  const isSupervisor = selection.kind === "supervisor";

  return (
    <aside className={styles.supervisionPanel} aria-live="polite" aria-label={`Contexto de ${person?.name ?? "liderança"}`}>
      <div className={styles.panelIdentity}>
        <h2>{person?.name}</h2>
        <ContextTag>{isSupervisor ? "Supervisor" : "Líder"}</ContextTag>
      </div>
      <dl className={styles.cellContextDetails}>
        <div>
          <dt>Célula que lidera</dt>
          <dd><strong>{cell?.name ?? "Não registrada"}</strong>{cell ? <span>{cell.weekday[0].toLocaleUpperCase("pt-BR") + cell.weekday.slice(1)} · {cell.startTime}</span> : null}</dd>
        </div>
        {isSupervisor ? <>
          <div><dt>Líderes acompanhados</dt><dd><strong>{supervision.supervisedLeaderIds.length} {supervision.supervisedLeaderIds.length === 1 ? "líder" : "líderes"}</strong></dd></div>
          <div><dt>Células relacionadas</dt><dd>{relatedCells.map((relatedCell) => <strong key={relatedCell!.id}>{relatedCell!.name}</strong>)}</dd></div>
        </> : <div><dt>Acompanhamento atual</dt><dd><strong>{getPastoralPerson(supervision.supervisorId)?.name}</strong><span>Supervisor</span></dd></div>}
      </dl>
    </aside>
  );
}

export function PastoralSupervisionView({ mode }: { mode: "list" | "structure" }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ x: number; y: number; left: number; top: number } | null>(null);
  const initial = pastoralSupervisionsMock[0];
  const [selection, setSelection] = useState<Selection | null>(initial ? { kind: "supervisor", personId: initial.supervisorId, supervisionId: initial.id } : null);
  const [scale, setScale] = useState(1);
  const groups = useMemo(() => pastoralSupervisionsMock.map((supervision) => ({
    supervision,
    supervisor: getPastoralPerson(supervision.supervisorId),
    ledCell: getPastoralCell(supervision.ledCellId),
    leaders: supervision.supervisedLeaderIds.map((personId) => ({ person: getPastoralPerson(personId), cell: ledCellFor(personId) })),
  })), []);

  const fitStructure = useCallback(() => {
    const viewport = viewportRef.current;
    const forest = viewport?.querySelector<HTMLElement>(`.${styles.supervisionForest}`);
    if (!viewport || !forest) return;
    const naturalWidth = forest.scrollWidth / scale;
    const naturalHeight = forest.scrollHeight / scale;
    const availableWidth = viewport.clientWidth - (window.innerWidth < 720 ? 24 : 56);
    const availableHeight = viewport.clientHeight - (window.innerWidth < 720 ? 32 : 48);
    setScale(Math.max(window.innerWidth < 720 ? .85 : .72, Math.min(1.15, availableWidth / naturalWidth, availableHeight / naturalHeight)));
    window.setTimeout(() => viewport.scrollTo({ left: 0, top: 0, behavior: "smooth" }), 0);
  }, [scale]);

  useEffect(() => {
    if (mode !== "structure") return;
    const timer = window.setTimeout(fitStructure, 40);
    return () => window.clearTimeout(timer);
  }, [fitStructure, mode, selection]);

  if (!groups.length) return <div className={styles.supervisionEmpty}><ContextTag>Estrutura de acompanhamento</ContextTag><p>Nenhuma relação de supervisão está registrada.</p></div>;

  return (
    <div className={`${styles.supervisionWorkspace} ${selection ? styles.supervisionWorkspaceWithPanel : ""}`}>
      {mode === "list" ? (
        <div className={styles.supervisionList}>
          {groups.map(({ supervision, supervisor, ledCell, leaders }) => (
            <button className={styles.supervisionGroup} key={supervision.id} type="button" onClick={() => setSelection({ kind: "supervisor", personId: supervision.supervisorId, supervisionId: supervision.id })} aria-pressed={selection?.kind === "supervisor" && selection.supervisionId === supervision.id}>
              <span className={styles.supervisorIdentity}><strong>{supervisor?.name}</strong><span>Supervisor</span></span>
              <span className={styles.supervisionLedCell}><span>Célula que lidera</span><strong>{ledCell?.name}</strong>{ledCell ? <small>{ledCell.weekday[0].toLocaleUpperCase("pt-BR") + ledCell.weekday.slice(1)} · {ledCell.startTime}</small> : null}</span>
              <span className={styles.supervisedLeaders}><span>Líderes acompanhados</span>{leaders.map(({ person, cell }) => <span className={styles.supervisedLeaderSummary} key={person!.id}><strong>{person?.name}</strong><small>{cell?.name ?? "Célula não registrada"}</small></span>)}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className={styles.supervisionStructureArea}>
          <TreeControls label="Controles da estrutura de acompanhamento" onZoomIn={() => setScale((current) => Math.min(1.4, current + .1))} onZoomOut={() => setScale((current) => Math.max(.65, current - .1))} onFit={fitStructure} />
          <div ref={viewportRef} className={styles.supervisionCanvas} aria-label="Estrutura atual de acompanhamento"
            onPointerDown={(event) => { if ((event.target as HTMLElement).closest("button")) return; const viewport = viewportRef.current; if (!viewport) return; dragRef.current = { x: event.clientX, y: event.clientY, left: viewport.scrollLeft, top: viewport.scrollTop }; viewport.setPointerCapture(event.pointerId); }}
            onPointerMove={(event) => { const drag = dragRef.current; const viewport = viewportRef.current; if (!drag || !viewport) return; viewport.scrollLeft = drag.left - (event.clientX - drag.x); viewport.scrollTop = drag.top - (event.clientY - drag.y); }}
            onPointerUp={() => { dragRef.current = null; }} onPointerCancel={() => { dragRef.current = null; }}>
          <div className={styles.supervisionForest} style={{ zoom: scale }}>
            {groups.map(({ supervision, supervisor, ledCell, leaders }) => (
              <section className={`${styles.supervisionTreeGroup}${selection?.kind === "supervisor" && selection.supervisionId === supervision.id ? ` ${styles.supervisionTreeGroupSelected}` : ""}`} key={supervision.id} aria-label={`Acompanhamento de ${supervisor?.name}`}>
                <button className={styles.supervisorNode} type="button" onClick={() => setSelection({ kind: "supervisor", personId: supervision.supervisorId, supervisionId: supervision.id })} aria-pressed={selection?.kind === "supervisor" && selection.supervisionId === supervision.id}>
                  <span className={styles.supervisionNodeHeader}><strong>{supervisor?.name}</strong><ContextTag>Supervisor</ContextTag></span><span className={styles.supervisionNodeCell}>{ledCell?.name}</span>{ledCell ? <small>{ledCell.weekday[0].toLocaleUpperCase("pt-BR") + ledCell.weekday.slice(1)} · {ledCell.startTime}</small> : null}
                </button>
                <ul>{leaders.map(({ person, cell }) => <li key={person!.id}><button className={styles.leaderNode} type="button" onClick={() => setSelection({ kind: "leader", personId: person!.id, supervisionId: supervision.id })} aria-pressed={selection?.kind === "leader" && selection.personId === person!.id}><span className={styles.supervisionNodeHeader}><strong>{person?.name}</strong><ContextTag>Líder</ContextTag></span><span className={styles.supervisionNodeCell}>{cell?.name}</span></button></li>)}</ul>
              </section>
            ))}
          </div></div>
        </div>
      )}
      {selection ? <SupervisionPanel selection={selection} /> : null}
    </div>
  );
}
