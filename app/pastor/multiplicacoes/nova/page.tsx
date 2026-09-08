import Link from "next/link";
import { ContextTag } from "@/components/portal-patterns";
import { pastoralCellsMock } from "@/data/pastoral-structure";
import styles from "../../pastor.module.css";
import pageStyles from "./new-preparation.module.css";
import { NewPreparationForm } from "./new-preparation-form";

export default function Page() {
  const activeCells = pastoralCellsMock.filter((cell) => cell.status === "Ativa");

  return (
    <div className={`${styles.directoryPage} ${pageStyles.page}`}>
      <Link className={styles.backToOverview} href="/pastor/multiplicacoes">‹ Voltar para Multiplicações</Link>

      <header className={pageStyles.heading}>
        <p className={pageStyles.eyebrow}>Nova preparação</p>
        <h1>Iniciar preparação da multiplicação</h1>
        <p>Defina primeiro qual célula ativa dará origem à nova multiplicação. Essa origem passa a fazer parte do histórico do processo.</p>
      </header>

      <section className={pageStyles.section}>
        <div className={pageStyles.sectionHeading}>
          <ContextTag>Origem da multiplicação</ContextTag>
          <h2>Selecione a célula de origem</h2>
          <p>Os demais dados da futura célula serão preenchidos na próxima etapa.</p>
        </div>
        <NewPreparationForm cells={activeCells} />
      </section>
    </div>
  );
}
