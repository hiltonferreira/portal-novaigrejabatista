import { SectionBlock } from "@/components/portal-patterns";
import { PastoralCoordinationNavigation } from "../../_components/pastoral-coordination-navigation";
import { PastoralCoordinationView } from "../../_components/pastoral-coordination-view";
import styles from "../../pastor.module.css";

export default function Page() {
  return <div className={styles.directoryPage}>
    <PastoralCoordinationNavigation />
    <SectionBlock label="Coordenação" id="pastoral-coordination-structure">
      <div className={styles.supervisionIntroduction}><h2>Estrutura de acompanhamento</h2><p>Visualize as relações atuais entre Coordenadores e Supervisores vinculados.</p></div>
      <PastoralCoordinationView mode="structure" />
    </SectionBlock>
  </div>;
}
