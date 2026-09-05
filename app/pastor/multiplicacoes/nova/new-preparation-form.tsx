"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ChurchCell } from "@/data/cell";
import styles from "./new-preparation.module.css";

type Props = {
  cells: readonly ChurchCell[];
};

export function NewPreparationForm({ cells }: Props) {
  const router = useRouter();
  const [cellId, setCellId] = useState("");

  function startPreparation(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!cellId) return;

    router.push(`/pastor/multiplicacoes/rascunho?cellId=${encodeURIComponent(cellId)}`);
  }

  return (
    <form className={styles.form} onSubmit={startPreparation}>
      <div className={styles.field}>
        <label htmlFor="originCell">Célula de origem</label>
        <select id="originCell" name="originCell" value={cellId} onChange={(event) => setCellId(event.target.value)} required>
          <option value="">Selecionar célula ativa</option>
          {cells.map((cell) => (
            <option key={cell.id} value={cell.id}>{cell.name}</option>
          ))}
        </select>
        <small>Depois que a preparação for iniciada, a célula de origem ficará vinculada ao processo e não poderá ser trocada.</small>
      </div>

      <div className={styles.readonlyGrid}>
        <div>
          <span>Iniciado por</span>
          <strong>Usuário atual</strong>
          <small>O sistema registrará a pessoa autenticada quando houver persistência.</small>
        </div>
        <div>
          <span>Data de início</span>
          <strong>Registrada ao iniciar</strong>
        </div>
      </div>

      <div className={styles.actions}>
        <button className="action-link primary" type="submit" disabled={!cellId}>Continuar preparação</button>
        <p>Esta etapa define a origem da multiplicação antes dos demais dados da futura célula.</p>
      </div>
    </form>
  );
}
