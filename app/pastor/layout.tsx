import { PageTitle } from "@/components/page-title";
import { PortalShell } from "@/components/portal-shell";
import { PageHeaderFrame } from "@/components/page-header-frame";
import { PastorHeaderContext, PastorNavigation } from "./_components/pastor-navigation";
import styles from "./pastor.module.css";

export default function PastorLayout({ children }: { children: React.ReactNode }) {
  return (
    <PortalShell currentPath="/lideranca" className={styles.pastorTheme}>
      <PageHeaderFrame left={<PageTitle leading="Liderança" accent="Pastoral" />} right={<PastorHeaderContext />} navigation={<PastorNavigation />} />
      {children}
    </PortalShell>
  );
}
