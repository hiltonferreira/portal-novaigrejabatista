import Link from "next/link";
import { SectionBlock } from "@/components/portal-patterns";
import { traineeLeadersMock } from "@/data/leadership-development";
import styles from "../pastor.module.css";
import traineeStyles from "./trainee-leaders.module.css";
import { TraineeListClient } from "./trainee-list-client";

export default function Page() {
  return <div className={`${styles.directoryPage} ${traineeStyles.page}`}>
    <Link className={styles.backToOverview} href="/pastor">‹ Voltar para Visão Geral</Link>
    <header className={traineeStyles.heading}>
      <div><p className={traineeStyles.eyebrow}>Desenvolvimento de liderança</p><h1>Líderes em Treinamento</h1><p>Acompanhe as pessoas designadas para desenvolvimento de liderança nas células.</p></div>
      <Link className="action-link primary" href="/pastor/lideres-em-treinamento/designar">Designar Líder em Treinamento</Link>
    </header>
    <SectionBlock id="trainee-leaders-in-development" label="Em desenvolvimento">
      <TraineeListClient initial={traineeLeadersMock} />
    </SectionBlock>
  </div>;
}
