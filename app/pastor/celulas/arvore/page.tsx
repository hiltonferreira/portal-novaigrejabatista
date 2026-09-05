import { PastoralCellTree } from "../../_components/pastoral-cell-tree";
import { PastoralCellsNavigation } from "../../_components/pastoral-cells-navigation";
import styles from "../../pastor.module.css";

export default function Page() {
  return (
    <div className={styles.directoryPage}>
      <PastoralCellsNavigation />
      <PastoralCellTree />
    </div>
  );
}
