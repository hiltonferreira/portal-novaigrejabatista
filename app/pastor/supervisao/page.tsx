import { SectionBlock } from "@/components/portal-patterns";
import { PastoralSupervisionNavigation } from "../_components/pastoral-supervision-navigation";
import { PastoralSupervisionView } from "../_components/pastoral-supervision-view";
import styles from "../pastor.module.css";

export default function Page() {
  return <div className={styles.directoryPage}>
    <PastoralSupervisionNavigation />
    <SectionBlock label="Supervisão" id="pastoral-supervision-list">
      <div className={styles.supervisionIntroduction}><h2>Estrutura de acompanhamento</h2><p>Acompanhe os supervisores, os líderes acompanhados e as células relacionadas.</p></div>
      <PastoralSupervisionView mode="list" />
    </SectionBlock>
  </div>;
}
