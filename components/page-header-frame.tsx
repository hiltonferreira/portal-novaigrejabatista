import styles from "./page-header-frame.module.css";

export function PageHeaderFrame({ left, right, navigation }: { left: React.ReactNode; right: React.ReactNode; navigation: React.ReactNode }) {
  return <div className={styles.frame}>
    <header className={styles.header}>
      <div className={styles.left}>{left}</div>
      <div className={styles.right}>{right}</div>
    </header>
    <div className={styles.navigation}>{navigation}</div>
  </div>;
}
