import Link from "next/link";
import { ContextTag } from "@/components/portal-patterns";
import { leadershipDesignationCandidatesMock } from "@/data/leadership-development";
import { churchCellsMock } from "@/data/cell";
import styles from "../../pastor.module.css";
import formStyles from "./designation.module.css";
import { DesignationForm } from "./designation-form";

export default function Page() {
  return <div className={`${styles.directoryPage} ${formStyles.page}`}>
    <Link className={styles.backToOverview} href="/pastor/lideres-em-treinamento">‹ Voltar para Líderes em Treinamento</Link>
    <header className={formStyles.heading}><p className={formStyles.eyebrow}>Nova designação</p><h1>Designar Líder em Treinamento</h1><p>A designação é uma decisão humana de desenvolvimento de liderança. Iniciar a Jornada DNA não cria esta função automaticamente.</p></header>
    <section className={formStyles.section}>
      <div className={formStyles.sectionHeading}><ContextTag>Designação</ContextTag><h2>Defina a pessoa e o contexto</h2><p>O estado da Jornada DNA é informativo e não representa score ou prontidão para liderar.</p></div>
      <DesignationForm candidates={leadershipDesignationCandidatesMock} cells={churchCellsMock} />
    </section>
  </div>;
}
