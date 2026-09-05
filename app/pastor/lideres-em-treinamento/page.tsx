import Link from "next/link";
import { ContextTag, SectionBlock, StatusTag } from "@/components/portal-patterns";
import { traineeLeadersMock } from "@/data/leadership-development";
import styles from "../pastor.module.css";
import traineeStyles from "./trainee-leaders.module.css";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
function formatDate(date: string) { return dateFormatter.format(new Date(`${date}T12:00:00`)); }

export default function Page() {
  return <div className={`${styles.directoryPage} ${traineeStyles.page}`}>
    <Link className={styles.backToOverview} href="/pastor">‹ Voltar para Visão Geral</Link>
    <header className={traineeStyles.heading}>
      <div><p className={traineeStyles.eyebrow}>Desenvolvimento de liderança</p><h1>Líderes em Treinamento</h1><p>Acompanhe as pessoas designadas para desenvolvimento de liderança nas células.</p></div>
      <Link className="action-link primary" href="/pastor/lideres-em-treinamento/designar">Designar Líder em Treinamento</Link>
    </header>
    <SectionBlock id="trainee-leaders-in-development" label="Em desenvolvimento">
      <div className={traineeStyles.grid}>{traineeLeadersMock.map((trainee) => <article className={`${styles.overviewCard} ${traineeStyles.card}`} key={trainee.id}>
        <div className={traineeStyles.cardHeader}><ContextTag>Desenvolvimento de liderança</ContextTag><StatusTag tone="progress">Em desenvolvimento</StatusTag></div>
        <div className={traineeStyles.identity}><h2>{trainee.personName}</h2><p>Líder em Treinamento · {trainee.cellName}</p></div>
        <dl className={traineeStyles.details}>
          <div><dt>Célula</dt><dd>{trainee.cellName}</dd></div><div><dt>Designada em</dt><dd>{formatDate(trainee.designatedOn)}</dd></div>
          <div><dt>Jornada DNA</dt><dd>{trainee.journey.completedModules} de {trainee.journey.totalModules} módulos concluídos</dd></div><div><dt>Contexto atual</dt><dd>{trainee.journey.currentModule}</dd></div>
        </dl>
        <Link className="action-link secondary" href={`/pastor/lideres-em-treinamento/${trainee.id}`}>Ver acompanhamento</Link>
      </article>)}</div>
    </SectionBlock>
  </div>;
}
