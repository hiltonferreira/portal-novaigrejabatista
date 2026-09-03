import styles from "./page-title.module.css";

export function PageTitle({ leading, accent }: { leading: string; accent: string }) {
  return (
    <h1 className={styles.title}>
      <span>{leading}</span>{" "}<em className={styles.accent}>{accent}</em>
    </h1>
  );
}
