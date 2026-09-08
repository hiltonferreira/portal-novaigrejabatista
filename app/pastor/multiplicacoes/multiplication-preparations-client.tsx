"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ContextTag, StatusTag } from "@/components/portal-patterns";
import type { ChurchCell } from "@/data/cell";
import type { PastoralPerson } from "@/data/pastoral-structure";
import { readStoredPreparations, type StoredMultiplicationPreparation } from "@/lib/test-persistence";
import styles from "../pastor.module.css";
import multiplicationStyles from "./multiplicacoes.module.css";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
function formatDate(date: string) { return dateFormatter.format(new Date(`${date}T12:00:00`)); }

type Props = { initial: readonly StoredMultiplicationPreparation[]; cells: readonly ChurchCell[]; people: readonly PastoralPerson[] };

export function MultiplicationPreparationsClient({ initial, cells, people }: Props) {
  const [items, setItems] = useState<StoredMultiplicationPreparation[]>([...initial]);
  useEffect(() => {
    const stored = readStoredPreparations();
    const byId = new Map(initial.map((item) => [item.id, item]));
    for (const item of stored) byId.set(item.id, { ...(byId.get(item.id) ?? {}), ...item } as StoredMultiplicationPreparation);
    setItems([...byId.values()]);
  }, [initial]);

  if (!items.length) return <article className={`${styles.overviewCard} ${multiplicationStyles.card}`}><ContextTag>Acompanhamento da multiplicação</ContextTag><p>Nenhuma multiplicação está em preparação neste momento.</p></article>;

  return <div className={multiplicationStyles.grid}>{items.map((item) => {
    const parentCell = cells.find((cell) => cell.id === item.parentCellId);
    const futureLeader = people.find((person) => person.id === item.futureLeaderId);
    return <article className={`${styles.overviewCard} ${multiplicationStyles.card}`} key={item.id}>
      <div className={multiplicationStyles.cardHeader}><ContextTag>Acompanhamento da multiplicação</ContextTag><StatusTag tone="progress">Em preparação</StatusTag></div>
      <div className={multiplicationStyles.identity}><h2>{parentCell?.name ?? "Célula de origem"}</h2><p>{item.description}</p></div>
      <dl className={multiplicationStyles.details}>
        <div><dt>Célula de origem</dt><dd>{parentCell?.name ?? "Não registrada"}</dd></div><div><dt>Processo iniciado</dt><dd>{formatDate(item.startedOn)}</dd></div>
        <div><dt>Futura liderança</dt><dd className={!futureLeader ? multiplicationStyles.pendingValue : undefined}>{futureLeader?.name ?? "Ainda não definida"}</dd></div><div><dt>Previsão</dt><dd className={!item.expectedDate ? multiplicationStyles.pendingValue : undefined}>{item.expectedDate ? formatDate(item.expectedDate) : "Ainda não definida"}</dd></div>
        <div><dt>Nome futuro</dt><dd className={!item.futureName ? multiplicationStyles.pendingValue : undefined}>{item.futureName ?? "Ainda não definido"}</dd></div><div><dt>Pessoas previstas</dt><dd className={!(item.people?.length) ? multiplicationStyles.pendingValue : undefined}>{item.people?.length ? `${item.people.length} ${item.people.length === 1 ? "pessoa" : "pessoas"}` : "Ainda não registradas"}</dd></div>
      </dl>
      <Link className="action-link primary" href={`/pastor/multiplicacoes/${item.id}`}>Gerenciar preparação</Link>
    </article>;
  })}</div>;
}
