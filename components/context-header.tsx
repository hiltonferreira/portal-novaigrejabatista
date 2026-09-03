import styles from "./context-header.module.css";

export function ContextHeader({
  title,
  primary,
  secondary,
  secondaryLabel,
  secondaryActionStyle = "text",
}: {
  title: React.ReactNode;
  primary: React.ReactNode;
  secondary: React.ReactNode;
  secondaryLabel?: string;
  secondaryActionStyle?: "text" | "button";
}) {
  return (
    <header className={styles.header}>
      {title}
      <div className={styles.context}>
        <div className={styles.primary}>{primary}</div>
        <div className={`${styles.secondary} ${secondaryActionStyle === "button" ? styles.secondaryWithButton : ""}`}>
          {secondaryLabel ? <span className={styles.secondaryLabel}>{secondaryLabel}</span> : null}
          {secondary}
        </div>
      </div>
    </header>
  );
}
