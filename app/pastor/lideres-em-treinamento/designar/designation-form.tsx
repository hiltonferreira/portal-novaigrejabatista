"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ChurchCell } from "@/data/cell";
import { readStoredTrainees, writeStoredTrainees } from "@/lib/test-persistence";
import formStyles from "./designation.module.css";

type Candidate = { id: string; name: string; journeyLabel: string };

type Props = { candidates: readonly Candidate[]; cells: readonly ChurchCell[] };

export function DesignationForm({ candidates, cells }: Props) {
  const router = useRouter();
  const [personId, setPersonId] = useState("");
  const [cellId, setCellId] = useState("");
  const [saved, setSaved] = useState(false);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const person = candidates.find((item) => item.id === personId);
    const cell = cells.find((item) => item.id === cellId);
    if (!person || !cell) return;

    const id = `trainee-${person.id.replace(/^person-/, "")}-${Date.now()}`;
    const today = new Date();
    const designatedOn = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    const stored = readStoredTrainees();
    writeStoredTrainees([...stored, {
      id,
      personId: person.id,
      personName: person.name,
      cellId: cell.id,
      cellName: cell.name,
      designatedOn,
      journey: { completedModules: 0, totalModules: 4, currentModule: "Jornada DNA iniciada" },
    }]);
    setSaved(true);
    window.setTimeout(() => router.push("/pastor/lideres-em-treinamento"), 500);
  }

  return <form className={formStyles.form} onSubmit={submit}>
    <label>Pessoa<select name="person" value={personId} onChange={(event) => setPersonId(event.target.value)} required><option value="">Selecionar pessoa</option>{candidates.map((person)=><option key={person.id} value={person.id}>{person.name} · {person.journeyLabel}</option>)}</select></label>
    <label>Célula de desenvolvimento<select name="cell" value={cellId} onChange={(event) => setCellId(event.target.value)} required><option value="">Selecionar célula ativa</option>{cells.filter((cell)=>cell.status==="Ativa").map((cell)=><option key={cell.id} value={cell.id}>{cell.name}</option>)}</select></label>
    <div className={formStyles.note}><strong>Sobre a Jornada DNA</strong><p>A pessoa pode ser designada para desenvolvimento após iniciar a Jornada DNA. A conclusão integral será exigida antes de uma eventual designação como Líder, que também depende de decisão humana.</p></div>
    <div className={formStyles.actions}><button className="action-link primary" type="submit" disabled={!personId || !cellId}>Confirmar designação</button><p>{saved ? "Designação salva para teste. Redirecionando…" : "As alterações ficam salvas neste navegador durante os testes."}</p></div>
  </form>;
}
