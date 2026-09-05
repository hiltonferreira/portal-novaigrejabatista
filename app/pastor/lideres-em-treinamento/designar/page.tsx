import Link from "next/link";
import { ContextTag } from "@/components/portal-patterns";
import { leadershipDesignationCandidatesMock } from "@/data/leadership-development";
import { churchCellsMock } from "@/data/cell";
import styles from "../../pastor.module.css";
import formStyles from "./designation.module.css";

export default function Page() {
  return <div className={`${styles.directoryPage} ${formStyles.page}`}>
    <Link className={styles.backToOverview} href="/pastor/lideres-em-treinamento">‹ Voltar para Líderes em Treinamento</Link>
    <header className={formStyles.heading}><p className={formStyles.eyebrow}>Nova designação</p><h1>Designar Líder em Treinamento</h1><p>A designação é uma decisão humana de desenvolvimento de liderança. Iniciar a Jornada DNA não cria esta função automaticamente.</p></header>
    <section className={formStyles.section}>
      <div className={formStyles.sectionHeading}><ContextTag>Designação</ContextTag><h2>Defina a pessoa e o contexto</h2><p>O estado da Jornada DNA é informativo e não representa score ou prontidão para liderar.</p></div>
      <form className={formStyles.form}>
        <label>Pessoa<select name="person" defaultValue=""><option value="">Selecionar pessoa</option>{leadershipDesignationCandidatesMock.map((person)=><option key={person.id} value={person.id}>{person.name} · {person.journeyLabel}</option>)}</select></label>
        <label>Célula de desenvolvimento<select name="cell" defaultValue=""><option value="">Selecionar célula ativa</option>{churchCellsMock.filter((cell)=>cell.status==="Ativa").map((cell)=><option key={cell.id} value={cell.id}>{cell.name}</option>)}</select></label>
        <div className={formStyles.note}><strong>Sobre a Jornada DNA</strong><p>A pessoa pode ser designada para desenvolvimento após iniciar a Jornada DNA. A conclusão integral será exigida antes de uma eventual designação como Líder, que também depende de decisão humana.</p></div>
        <div className={formStyles.actions}><button className="action-link primary" type="button">Confirmar designação</button><p>Esta versão demonstra o fluxo e não persiste alterações.</p></div>
      </form>
    </section>
  </div>;
}
