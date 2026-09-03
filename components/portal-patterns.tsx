import styles from "./portal-patterns.module.css";

export function ContextTag({ children, id }: { children: React.ReactNode; id?: string }) {
  return <span className={styles.contextTag} id={id}>{children}</span>;
}

export type StatusTone = "neutral" | "action" | "progress" | "success";

export function StatusTag({ children, tone }: { children: React.ReactNode; tone: StatusTone }) {
  return <span className={`${styles.statusTag} ${styles[tone]}`}>{children}</span>;
}

export function SectionLabel({ children, id, level = 2 }: { children: React.ReactNode; id?: string; level?: 2 | 3 }) {
  const Tag = level === 3 ? "h3" : "h2";
  return <Tag className={styles.sectionLabel} id={id}>{children}</Tag>;
}

export function ResponsibilityTags({ label, items }: { label: string; items: readonly string[] }) {
  return (
    <div className={styles.responsibilities}>
      <span>{label}</span>
      <ul aria-label={label}>
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </div>
  );
}
