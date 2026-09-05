"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ContextTag, SectionBlock, StatusTag, type StatusTone } from "@/components/portal-patterns";
import {
  getPastoralCell,
  getPastoralPerson,
  pastoralCellsMock,
  pastoralMultiplicationsMock,
  pastoralSupervisionsMock,
} from "@/data/pastoral-structure";
import type { ChurchCell } from "@/data/cell";
import styles from "../pastor.module.css";
import { TreeControls } from "./tree-controls";

const statusTone: Record<ChurchCell["status"], StatusTone> = {
  "Em implantação": "progress",
  Ativa: "success",
  Inativa: "neutral",
};

const effectiveMultiplications = pastoralMultiplicationsMock.filter(
  (multiplication): multiplication is Extract<(typeof pastoralMultiplicationsMock)[number], { childCellId: string }> =>
    multiplication.state === "Efetivada" && "childCellId" in multiplication,
);

const normalizeSearch = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");

export function PastoralCellTree() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef(new Map<string, HTMLButtonElement>());
  const dragRef = useRef<{ x: number; y: number; left: number; top: number } | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(() => new Set());
  const [query, setQuery] = useState("");
  const [scale, setScale] = useState(1);

  const structure = useMemo(() => {
    const cellById = new Map(pastoralCellsMock.map((cell) => [cell.id, cell]));
    const parentById = new Map<string, string>();
    const childrenById = new Map<string, ChurchCell[]>();

    for (const multiplication of effectiveMultiplications) {
      const parent = cellById.get(multiplication.parentCellId);
      const child = cellById.get(multiplication.childCellId);
      if (!parent || !child) continue;
      parentById.set(child.id, parent.id);
      childrenById.set(parent.id, [...(childrenById.get(parent.id) ?? []), child]);
    }

    const roots = pastoralCellsMock.filter((cell) => !parentById.has(cell.id));
    return { cellById, parentById, childrenById, roots };
  }, []);

  const focusedVisibleIds = useMemo(() => {
    if (!focusedId) return null;
    const visible = new Set<string>();
    let currentId: string | undefined = focusedId;
    while (currentId) {
      visible.add(currentId);
      currentId = structure.parentById.get(currentId);
    }
    const addDescendants = (cellId: string) => {
      for (const child of structure.childrenById.get(cellId) ?? []) {
        visible.add(child.id);
        addDescendants(child.id);
      }
    };
    addDescendants(focusedId);
    return visible;
  }, [focusedId, structure]);

  const visibleRoots = focusedVisibleIds
    ? structure.roots.filter((root) => focusedVisibleIds.has(root.id))
    : structure.roots;
  const selectedCell = selectedId ? structure.cellById.get(selectedId) : undefined;
  const searchResults = query.trim()
    ? pastoralCellsMock.filter((cell) => normalizeSearch(cell.name).includes(normalizeSearch(query))).slice(0, 6)
    : [];

  const descendantCount = useCallback((cellId: string): number => (
    (structure.childrenById.get(cellId) ?? []).reduce((total, child) => total + 1 + descendantCount(child.id), 0)
  ), [structure.childrenById]);

  const centerNode = useCallback((cellId: string, behavior: ScrollBehavior = "smooth") => {
    const viewport = viewportRef.current;
    const node = nodeRefs.current.get(cellId);
    if (!viewport || !node) return;
    const viewportRect = viewport.getBoundingClientRect();
    const nodeRect = node.getBoundingClientRect();
    viewport.scrollBy({
      left: nodeRect.left - viewportRect.left - viewportRect.width / 2 + nodeRect.width / 2,
      top: nodeRect.top - viewportRect.top - viewportRect.height / 2 + nodeRect.height / 2,
      behavior,
    });

    const protectedBottom = window.innerWidth < 1024 ? window.innerHeight - 88 : window.innerHeight - 20;
    const refreshedRect = node.getBoundingClientRect();
    if (refreshedRect.bottom > protectedBottom) {
      window.scrollBy({ top: refreshedRect.bottom - protectedBottom + 20, behavior });
    } else if (refreshedRect.top < 20) {
      window.scrollBy({ top: refreshedRect.top - 20, behavior });
    }
  }, []);

  const fitTree = useCallback((behavior: ScrollBehavior = "smooth") => {
    const viewport = viewportRef.current;
    const tree = viewport?.querySelector<HTMLElement>(`.${styles.treeForest}`);
    if (!viewport || !tree) return;
    const usableWidth = viewport.clientWidth - (window.innerWidth < 720 ? 28 : 64);
    const usableHeight = viewport.clientHeight - (window.innerWidth < 720 ? 92 : 64);
    const treeRect = tree.getBoundingClientRect();
    const naturalWidth = treeRect.width / scale;
    const naturalHeight = treeRect.height / scale;
    const widthScale = usableWidth / naturalWidth;
    const heightScale = usableHeight / naturalHeight;
    const minimumScale = window.innerWidth < 720 ? .9 : .65;
    setScale(Math.max(minimumScale, Math.min(1, widthScale, heightScale)));
    window.setTimeout(() => viewport.scrollTo({ left: 0, top: 0, behavior }), 0);
  }, [scale]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      fitTree("auto");
      if (selectedId) window.setTimeout(() => centerNode(selectedId, "auto"), 30);
    }, 40);
    return () => window.clearTimeout(timer);
  }, [centerNode, fitTree, focusedId, selectedId]);

  function revealAndSelect(cellId: string) {
    const expanded = new Set(collapsedIds);
    let ancestorId = structure.parentById.get(cellId);
    while (ancestorId) {
      expanded.delete(ancestorId);
      ancestorId = structure.parentById.get(ancestorId);
    }
    setCollapsedIds(expanded);
    setSelectedId(cellId);
    setQuery("");
    window.setTimeout(() => {
      centerNode(cellId);
      nodeRefs.current.get(cellId)?.focus({ preventScroll: true });
    }, 0);
  }

  function toggleBranch(cellId: string) {
    setCollapsedIds((current) => {
      const next = new Set(current);
      if (next.has(cellId)) next.delete(cellId); else next.add(cellId);
      return next;
    });
  }

  function TreeNode({ cell }: { cell: ChurchCell }) {
    const allChildren = structure.childrenById.get(cell.id) ?? [];
    const children = focusedVisibleIds ? allChildren.filter((child) => focusedVisibleIds.has(child.id)) : allChildren;
    const collapsed = collapsedIds.has(cell.id);
    const preparation = pastoralMultiplicationsMock.some((item) => item.state === "Em preparação" && item.parentCellId === cell.id);
    const hiddenCount = collapsed ? descendantCount(cell.id) : 0;

    return (
      <li className={styles.treeBranch}>
        <div className={styles.treeNodeUnit}>
          <button
            ref={(element) => { if (element) nodeRefs.current.set(cell.id, element); else nodeRefs.current.delete(cell.id); }}
            type="button"
            className={`${styles.cellTreeNode}${selectedId === cell.id ? ` ${styles.cellTreeNodeSelected}` : ""}`}
            aria-pressed={selectedId === cell.id}
            onClick={() => { setSelectedId(cell.id); window.setTimeout(() => centerNode(cell.id), 40); }}
          >
            <span className={styles.nodeHeader}>
              <strong>{cell.name}</strong>
              <StatusTag tone={statusTone[cell.status]}>{cell.status}</StatusTag>
            </span>
            <span>{getPastoralPerson(cell.leaderId)?.name ?? "Líder não registrado"} · Líder</span>
            <span>{cell.weekday[0].toLocaleUpperCase("pt-BR") + cell.weekday.slice(1)} · {cell.startTime}</span>
            {cell.establishedYear ? <span>Desde {cell.establishedYear}</span> : null}
            {preparation ? <span className={styles.multiplicationIndicator}>Multiplicação em preparação</span> : null}
          </button>
          {children.length ? (
            <div className={styles.branchControlArea}>
              <button type="button" className={styles.branchControl} aria-expanded={!collapsed} aria-label={`${collapsed ? "Expandir" : "Recolher"} descendentes de ${cell.name}`} onClick={() => toggleBranch(cell.id)}>
                <span aria-hidden="true">{collapsed ? "+" : "−"}</span>
              </button>
              {collapsed ? <small>{hiddenCount} {hiddenCount === 1 ? "descendente oculto" : "descendentes ocultos"}</small> : null}
            </div>
          ) : null}
        </div>
        {children.length && !collapsed ? <ul className={styles.treeChildren}>{children.map((child) => <TreeNode key={child.id} cell={child} />)}</ul> : null}
      </li>
    );
  }

  return (
    <SectionBlock id="pastoral-cell-tree" label="Árvore de células">
      <div className={styles.cellTreeShell}>
        <div className={styles.treeIntroduction}>
          <div><ContextTag>Linhagem de multiplicação</ContextTag><p>Visualize como as células se originaram a partir das multiplicações.</p></div>
          <div className={styles.cellSearch}>
            <label htmlFor="cell-tree-search">Buscar célula</label>
            <input id="cell-tree-search" type="search" value={query} placeholder="Buscar célula..." autoComplete="off" onChange={(event) => setQuery(event.target.value)} />
            {searchResults.length ? <ul aria-label="Resultados da busca">{searchResults.map((cell) => <li key={cell.id}><button type="button" onClick={() => revealAndSelect(cell.id)}>{cell.name}</button></li>)}</ul> : null}
          </div>
        </div>

        {focusedId ? <div className={styles.focusNotice}><span>Linhagem de {structure.cellById.get(focusedId)?.name}</span><button type="button" onClick={() => setFocusedId(null)}>Ver todas</button></div> : null}

        <div className={`${styles.treeWorkspace}${selectedCell ? ` ${styles.treeWorkspaceWithPanel}` : ""}`}>
          <div className={styles.treeMainArea}>
            <TreeControls label="Controles da árvore" onZoomIn={() => setScale((current) => Math.min(1.4, current + .1))} onZoomOut={() => setScale((current) => Math.max(.55, current - .1))} onFit={() => fitTree()} />
            <div
              ref={viewportRef}
              className={styles.treeViewport}
              onPointerDown={(event) => {
                if ((event.target as HTMLElement).closest("button, input")) return;
                const viewport = viewportRef.current;
                if (!viewport) return;
                dragRef.current = { x: event.clientX, y: event.clientY, left: viewport.scrollLeft, top: viewport.scrollTop };
                viewport.setPointerCapture(event.pointerId);
              }}
              onPointerMove={(event) => {
                const drag = dragRef.current;
                const viewport = viewportRef.current;
                if (!drag || !viewport) return;
                viewport.scrollLeft = drag.left - (event.clientX - drag.x);
                viewport.scrollTop = drag.top - (event.clientY - drag.y);
              }}
              onPointerUp={() => { dragRef.current = null; }}
              onPointerCancel={() => { dragRef.current = null; }}
            >
              {visibleRoots.length ? <div className={styles.treeScaleSurface} style={{ zoom: scale }}><ul className={styles.treeForest}>{visibleRoots.map((root) => <TreeNode key={root.id} cell={root} />)}</ul></div>
                : <p className={styles.treeEmptyState}>Nenhuma linhagem de multiplicação registrada.</p>}
            </div>
          </div>

          {selectedCell ? <CellContextPanel cell={selectedCell} parentId={structure.parentById.get(selectedCell.id)} directChildren={structure.childrenById.get(selectedCell.id) ?? []} onFocus={() => setFocusedId(selectedCell.id)} /> : null}
        </div>
      </div>
    </SectionBlock>
  );
}

function CellContextPanel({ cell, parentId, directChildren, onFocus }: { cell: ChurchCell; parentId?: string; directChildren: readonly ChurchCell[]; onFocus: () => void }) {
  const supervisor = pastoralSupervisionsMock.find((item) => item.supervisedLeaderIds.some((leaderId) => leaderId === cell.leaderId));
  const trainees = cell.traineeLeaderIds.map(getPastoralPerson).filter(Boolean);
  const weekday = cell.weekday[0].toLocaleUpperCase("pt-BR") + cell.weekday.slice(1);
  const multiplicationProcess = pastoralMultiplicationsMock.find((item) => item.state === "Em preparação" && item.parentCellId === cell.id);

  return (
    <aside className={styles.cellContextPanel} aria-label={`Contexto da célula ${cell.name}`}>
      <div className={styles.panelIdentity}><ContextTag>Detalhes da célula</ContextTag><h2>{cell.name}</h2><StatusTag tone={statusTone[cell.status]}>{cell.status}</StatusTag></div>
      <dl className={styles.cellContextDetails}>
        <div><dt>Liderança</dt><dd><strong>{getPastoralPerson(cell.leaderId)?.name ?? "Não registrada"}</strong>{trainees.map((person) => <span key={person!.id}>{person!.name} · Líder em Treinamento</span>)}</dd></div>
        <div><dt>Encontro habitual</dt><dd>{weekday} · {cell.startTime}</dd></div>
        {cell.establishedYear ? <div><dt>Início da célula</dt><dd>{cell.establishedYear}</dd></div> : null}
        {parentId ? <div><dt>Origem</dt><dd>{getPastoralCell(parentId)?.name}</dd></div> : null}
        <div><dt>Multiplicações diretas</dt><dd>{directChildren.length} {directChildren.length === 1 ? "célula" : "células"}</dd></div>
        <div><dt>Supervisão atual</dt><dd>{supervisor ? getPastoralPerson(supervisor.supervisorId)?.name : "Não registrada"}</dd></div>
        {multiplicationProcess ? <div><dt>Multiplicação</dt><dd>Em preparação</dd></div> : null}
      </dl>
      <button type="button" className="action-link secondary" onClick={onFocus}>Focar nesta célula</button>
    </aside>
  );
}
