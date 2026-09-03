import { ActionLink } from "@/components/portal-shell";
import { ContextTag } from "@/components/portal-patterns";
import styles from "../minha-celula.module.css";

export function AvailabilityCard({
  availableForSchedule,
  enabledServiceFunctions,
}: {
  availableForSchedule: boolean;
  enabledServiceFunctions: readonly string[];
}) {
  return (
    <div className={`${styles.card} ${styles.availability}`}>
      <ContextTag>Disponibilidade para servir</ContextTag>
      <div className={styles.availabilityContent}>
        <div className={styles.availabilityStatus}>
          <span>Você está disponível para escala</span>
          <strong>{availableForSchedule ? "Sim" : "Não"}</strong>
        </div>
        <div className={styles.enabledServices}>
          <span>Você pode servir em</span>
          <ul aria-label="Funções em que você pode servir">
            {enabledServiceFunctions.map((serviceFunction) => <li key={serviceFunction}>{serviceFunction}</li>)}
          </ul>
          <p>Estas são as funções em que você está habilitada para ser escalada.</p>
        </div>
        <ActionLink href="/minha-celula/escalas" variant="secondary">Atualizar disponibilidade</ActionLink>
      </div>
    </div>
  );
}
