import { PortalShell } from "@/components/portal-shell";
import { ContextHeader } from "@/components/context-header";
import { PageTitle } from "@/components/page-title";
import { ResponsibilityTags } from "@/components/portal-patterns";
import { genesisCellMock } from "@/data/cell";
import { homeMock } from "@/data/home";
import { CellTabs } from "./_components/cell-tabs";
import styles from "./minha-celula.module.css";

export default function MyCellLayout({ children }: { children: React.ReactNode }) {
  return (
    <PortalShell currentPath="/minha-celula" className={styles.cellTheme}>
      <ContextHeader
        title={<PageTitle leading="Minha" accent="célula" />}
        secondaryLabel="Horário e local"
        secondaryActionStyle="button"
        primary={
          <>
            <strong>{genesisCellMock.name}</strong>
            <ResponsibilityTags label="Você atua como" items={homeMock.responsibilities} />
          </>
        }
        secondary={
          <>
            <span>Encontros toda {genesisCellMock.weekday}, às {genesisCellMock.startTime}</span>
            <address>{genesisCellMock.address}</address>
            <a href={genesisCellMock.mapsUrl} target="_blank" rel="noopener noreferrer">Como chegar</a>
          </>
        }
      />
      <CellTabs />
      {children}
    </PortalShell>
  );
}
