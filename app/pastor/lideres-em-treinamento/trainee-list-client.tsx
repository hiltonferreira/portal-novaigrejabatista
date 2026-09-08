"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ContextTag, StatusTag } from "@/components/portal-patterns";
import type { StoredTraineeLeader } from "@/lib/test-persistence";
import { readStoredTrainees } from "@/lib/test-persistence";
import styles from "../pastor.module.css";
import traineeStyles from "./trainee-leaders.module.css";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
function formatDate(date: string) { return dateFormatter.format(new Date(`${date}T12:00:00`)); }

type Props = { initial: readonly StoredTraineeLeader[] };

export function TraineeListClient({ initial }: Props) {
  const [items, setItems] = useState<StoredTraineeLeader[]>([...initial]);

  useEffect(() => {
    const stored = readStoredTrainees();
    const merged = [...initial];
    for (const item of stored) if (!merged.some((current) => current.id === item.id)) merged.push(item);
    setItems(merged);
  }, [initial]);

  return <div className={traineeStyles.grid}>{items.map((trainee) => <article className={`${styles.overviewCard} ${traineeStyles.card}`} key={trainee.id}>
    <div className={traineeStyles.cardHeader}><ContextTag>Desenvolvimento de liderança</ContextTag><StatusTag tone="progress">Em desenvolvimento</StatusTag></div>
    <div className={traineeStyles.identity}><h2>{trainee.personName}</h2><p>Líder em Treinamento · {trainee.cellName}</p></div>
    <dl className={traineeStyles.details}>
      <div><dt>Célula</dt><dd>{trainee.cellName}</dd></div><div><dt>Designada em</dt><dd>{formatDate(trainee.designatedOn)}</dd></div>
      <div><dt>Jornada DNA</dt><dd>{trainee.journey.completedModules} de {trainee.journey.totalModules} módulos concluídos</dd></div><div><dt>Contexto atual</dt><dd>{trainee.journey.currentModule}</dd></div>
    </dl>
    <Link className="action-link secondary" href={`/pastor/lideres-em-treinamento/${trainee.id}`}>Ver acompanhamento</Link>
  </article>)}</div>;
}
