import { ContextTag, SectionLabel } from "@/components/portal-patterns";
import { genesisCellMock } from "@/data/cell";
import styles from "../minha-celula.module.css";

const nameCollator = new Intl.Collator("pt-BR", { sensitivity: "base" });

export default function PeoplePage() {
  const { participants, guestsInvitedByCurrentPerson } = genesisCellMock;
  const sortedParticipants = [...participants].sort((firstPerson, secondPerson) =>
    nameCollator.compare(firstPerson.name, secondPerson.name),
  );

  return (
    <div className={styles.peopleOverview}>
      <section className={styles.contextSection} aria-labelledby="participants-title">
        <SectionLabel id="participants-title">Participantes da Gênesis</SectionLabel>
        <div className={`${styles.card} ${styles.peopleCard}`}>
          <ContextTag>Nossa célula</ContextTag>
          <p className={styles.peopleIntroduction}>Pessoas que caminham com você na Gênesis.</p>
          <ul className={styles.peopleList} aria-label="Participantes da célula Gênesis">
            {sortedParticipants.map((person) => (
              <li key={person.name}>
                <strong>{person.name}</strong>
                <span>{person.cellRoles.length > 0 ? person.cellRoles.join(" · ") : person.churchRelationshipLabel}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={styles.contextSection} aria-labelledby="guests-title">
        <SectionLabel id="guests-title">Convidados</SectionLabel>
        <div className={`${styles.card} ${styles.peopleCard}`}>
          <ContextTag>Meus convidados</ContextTag>
          <ul className={`${styles.peopleList} ${styles.guestList}`} aria-label="Pessoas convidadas por Maria">
            {guestsInvitedByCurrentPerson.map((person) => (
              <li key={person.name}>
                <strong>{person.name}</strong>
                <span>{person.invitationLabel}</span>
              </li>
            ))}
          </ul>
          <button className={styles.secondaryButton} type="button">Adicionar convidado</button>
        </div>
      </section>
    </div>
  );
}
