"use client";

import { useState } from "react";
import styles from "./preparation.module.css";

type PersonOption = {
  name: string;
  churchRelationshipLabel: string;
};

export function PeopleSelector({ people, originName }: { people: readonly PersonOption[]; originName: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedNames, setSelectedNames] = useState<string[]>([]);

  function togglePerson(name: string) {
    setSelectedNames((current) => current.includes(name)
      ? current.filter((item) => item !== name)
      : [...current, name]);
  }

  return (
    <div className={styles.peopleSelector}>
      <div className={styles.peopleSummary}>
        <div>
          <strong>{selectedNames.length === 0 ? "Nenhuma pessoa prevista registrada." : `${selectedNames.length} ${selectedNames.length === 1 ? "pessoa selecionada" : "pessoas selecionadas"}`}</strong>
          <p>As pessoas selecionadas permanecem vinculadas à célula {originName} durante a preparação.</p>
        </div>
        <button className="action-link secondary" type="button" onClick={() => setIsOpen((current) => !current)} aria-expanded={isOpen} disabled={people.length === 0}>
          {people.length === 0 ? "Participantes indisponíveis" : isOpen ? "Fechar seleção" : "Selecionar pessoas"}
        </button>
      </div>

      {selectedNames.length > 0 && (
        <div className={styles.selectedPeople} aria-label="Pessoas previstas selecionadas">
          {selectedNames.map((name) => (
            <button key={name} type="button" onClick={() => togglePerson(name)} title={`Remover ${name}`}>
              {name}<span aria-hidden="true">×</span>
            </button>
          ))}
        </div>
      )}

      {isOpen && people.length > 0 && (
        <div className={styles.peopleOptions}>
          {people.map((person) => {
            const checked = selectedNames.includes(person.name);
            return (
              <label key={person.name}>
                <input type="checkbox" checked={checked} onChange={() => togglePerson(person.name)} />
                <span><strong>{person.name}</strong><small>{person.churchRelationshipLabel}</small></span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}
