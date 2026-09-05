import { ContextTag, SectionLabel } from "@/components/portal-patterns";
import styles from "../../../secretaria.module.css";

export function NewMeetingOperationState({ operation }: { operation: "Comunicação" | "Presença" | "Relatório" }) {
  return (
    <section aria-labelledby="new-meeting-operation-label">
      <SectionLabel id="new-meeting-operation-label">{operation}</SectionLabel>
      <article className={`${styles.card} ${styles.newMeetingOperationState}`}>
        <ContextTag>Encontro criado</ContextTag>
        <h2>{operation} ainda não iniciada</h2>
        <p>Este encontro está disponível para planejamento. Nenhum registro de {operation.toLocaleLowerCase("pt-BR")} foi criado.</p>
      </article>
    </section>
  );
}
