import { SectionLabel } from "@/components/portal-patterns";
import styles from "../secretaria.module.css";

export function SecretariatSectionPlaceholder({ title }: { title: string }) {
  return (
    <section className={styles.placeholder} aria-labelledby="secretariat-placeholder-title">
      <SectionLabel id="secretariat-placeholder-title">{title}</SectionLabel>
      <p>Esta área será detalhada em uma próxima etapa.</p>
    </section>
  );
}
