"use client";

import { useEffect, useState } from "react";
import { ContextTag, StatusTag } from "@/components/portal-patterns";
import type { StoredTraineeLeader } from "@/lib/test-persistence";
import { readStoredTrainees } from "@/lib/test-persistence";
import styles from "../../pastor.module.css";
import traineeStyles from "../trainee-leaders.module.css";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", { day:"2-digit", month:"long", year:"numeric" });

type Props = { traineeId: string; initial?: StoredTraineeLeader };

export function FollowUpClient({ traineeId, initial }: Props) {
  const [trainee, setTrainee] = useState<StoredTraineeLeader | undefined>(initial);
  useEffect(() => {
    const stored = readStoredTrainees().find((item) => item.id === traineeId);
    if (stored) setTrainee(stored);
  }, [traineeId]);

  if (!trainee) return <article className={`${styles.overviewCard} ${traineeStyles.card}`}><p>Registro de acompanhamento não encontrado neste navegador.</p></article>;

  return <>
    <header className={traineeStyles.heading}><div><p className={traineeStyles.eyebrow}>Acompanhamento</p><h1>{trainee.personName}</h1><p>Líder em Treinamento · {trainee.cellName}</p></div><StatusTag tone="progress">Em desenvolvimento</StatusTag></header>
    <article className={`${styles.overviewCard} ${traineeStyles.card}`}><ContextTag>Designação e Jornada DNA</ContextTag><dl className={traineeStyles.details}>
      <div><dt>Célula de desenvolvimento</dt><dd>{trainee.cellName}</dd></div><div><dt>Designada em</dt><dd>{dateFormatter.format(new Date(`${trainee.designatedOn}T12:00:00`))}</dd></div>
      <div><dt>Jornada DNA</dt><dd>{trainee.journey.completedModules} de {trainee.journey.totalModules} módulos concluídos</dd></div><div><dt>Contexto atual</dt><dd>{trainee.journey.currentModule}</dd></div>
    </dl><p className={traineeStyles.guidance}>O acompanhamento registra fatos do desenvolvimento. Não há score de prontidão, e a conclusão da Jornada DNA não promove automaticamente a pessoa a Líder.</p></article>
  </>;
}
