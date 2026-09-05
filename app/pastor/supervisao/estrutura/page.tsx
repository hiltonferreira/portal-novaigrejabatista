import { SectionBlock } from "@/components/portal-patterns";
import { PastoralSupervisionNavigation } from "../../_components/pastoral-supervision-navigation";
import { PastoralSupervisionView } from "../../_components/pastoral-supervision-view";
import styles from "../../pastor.module.css";

export default function Page() {
  return <div className={styles.directoryPage}>
    <PastoralSupervisionNavigation />
    <SectionBlock label="Supervisão" id="pastoral-supervision-structure">
      <div className={styles.supervisionIntroduction}><h2>Estrutura de acompanhamento</h2><p>Visualize as relações atuais entre Supervisores e Líderes acompanhados.</p></div>
      <PastoralSupervisionView mode="structure" />
    </SectionBlock>
  </div>;
}
