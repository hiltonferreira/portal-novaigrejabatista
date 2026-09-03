import { ContextTag, SectionLabel } from "@/components/portal-patterns";
import { genesisCellMock, mariaServiceAssignmentsMock } from "@/data/cell";
import { AvailabilityCard } from "../_components/availability-card";
import { PersonalScheduleList } from "../_components/personal-schedule-list";
import styles from "../minha-celula.module.css";

export default function SchedulesPage() {
  const { currentPerson } = genesisCellMock;

  return (
    <div className={styles.schedulesOverview}>
      <section className={styles.contextSection} aria-labelledby="upcoming-assignments-title">
        <SectionLabel id="upcoming-assignments-title">Minhas próximas escalas</SectionLabel>
        <div className={`${styles.card} ${styles.scheduleCard}`}>
          <ContextTag>Meu serviço</ContextTag>
          <PersonalScheduleList assignments={mariaServiceAssignmentsMock} />
        </div>
      </section>

      <section className={styles.contextSection} aria-labelledby="my-availability-title">
        <SectionLabel id="my-availability-title">Minha disponibilidade</SectionLabel>
        <AvailabilityCard
          availableForSchedule={currentPerson.availableForSchedule}
          enabledServiceFunctions={currentPerson.enabledServiceFunctions}
        />
      </section>
    </div>
  );
}
