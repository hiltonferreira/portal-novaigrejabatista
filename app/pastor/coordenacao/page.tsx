import { SectionBlock } from "@/components/portal-patterns";
import { PastoralCoordinationNavigation } from "../_components/pastoral-coordination-navigation";
import { PastoralCoordinationView } from "../_components/pastoral-coordination-view";
import styles from "../pastor.module.css";

export default function Page() {
  return <div className={styles.directoryPage}>
    <PastoralCoordinationNavigation />
    <SectionBlock label="Coordenação" id="pastoral-coordination-list">
      <div className={styles.supervisionIntroduction}><h2>Estrutura de acompanhamento</h2><p>Acompanhe os Coordenadores, os Supervisores vinculados e os contextos de liderança relacionados.</p></div>
      <PastoralCoordinationView mode="list" />
    </SectionBlock>
  </div>;
}
