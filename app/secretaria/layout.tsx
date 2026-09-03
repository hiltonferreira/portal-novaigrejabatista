import { PageTitle } from "@/components/page-title";
import { PortalShell } from "@/components/portal-shell";
import { secretariatOverviewMock } from "@/data/secretariat";
import { SecretariatTabs } from "./_components/secretariat-tabs";
import styles from "./secretaria.module.css";

export default function SecretariatLayout({ children }: { children: React.ReactNode }) {
  return (
    <PortalShell currentPath="/secretaria" className={styles.secretariatTheme}>
      <header className={styles.header}>
        <PageTitle leading="Secretaria da" accent="Célula" />
        <div className={styles.headerContext}>
          <span className={styles.cellContextTag}>{secretariatOverviewMock.cell.name}</span>
          <p>
            <span>{secretariatOverviewMock.supportingText.firstLine}</span>{" "}
            <span className={styles.descriptionContinuation}>{secretariatOverviewMock.supportingText.secondLine}</span>
          </p>
        </div>
      </header>
      <SecretariatTabs />
      {children}
    </PortalShell>
  );
}
