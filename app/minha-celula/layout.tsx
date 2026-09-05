import { PortalShell } from "@/components/portal-shell";
import { PageTitle } from "@/components/page-title";
import { PageHeaderFrame } from "@/components/page-header-frame";
import { ResponsibilityTags } from "@/components/portal-patterns";
import { genesisCellMock } from "@/data/cell";
import { homeMock } from "@/data/home";
import { CellTabs } from "./_components/cell-tabs";
import styles from "./minha-celula.module.css";

export default function MyCellLayout({ children }: { children: React.ReactNode }) {
  return (
    <PortalShell currentPath="/minha-celula" className={styles.cellTheme}>
      <PageHeaderFrame
        left={<>
          <PageTitle leading="Minha" accent="célula" />
          <div className={styles.headerPrimary}>
            <strong>{genesisCellMock.name}</strong>
            <ResponsibilityTags label="Você atua como" items={homeMock.responsibilities} />
          </div>
        </>}
        right={<div className={styles.headerSecondary}>
            <span className={styles.headerSecondaryLabel}>Horário e local</span>
            <span>Encontros toda {genesisCellMock.weekday}, às {genesisCellMock.startTime}</span>
            <address>{genesisCellMock.address}</address>
            <a href={genesisCellMock.mapsUrl} target="_blank" rel="noopener noreferrer">Como chegar</a>
          </div>}
        navigation={<CellTabs />}
      />
      {children}
    </PortalShell>
  );
}
