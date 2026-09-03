import styles from "../minha-celula.module.css";

export function CellSectionPlaceholder({ title }: { title: string }) {
  return (
    <section className={styles.placeholder} aria-labelledby="section-title">
      <p className={styles.eyebrow}>Minha Célula</p>
      <h2 id="section-title">{title}</h2>
      <p>Esta seção está preparada para uma próxima etapa.</p>
    </section>
  );
}
