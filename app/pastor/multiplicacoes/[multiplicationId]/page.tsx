import Link from "next/link";
import { genesisCellMock, churchCellsMock } from "@/data/cell";
import { pastoralMultiplicationsMock, pastoralPeopleMock } from "@/data/pastoral-structure";
import type { StoredMultiplicationPreparation } from "@/lib/test-persistence";
import styles from "../../pastor.module.css";
import managementStyles from "./preparation.module.css";
import { PreparationFormClient } from "./preparation-form-client";

export default async function Page({ params, searchParams }: { params: Promise<{ multiplicationId: string }>; searchParams: Promise<{ cellId?: string }> }) {
  const { multiplicationId } = await params;
  const { cellId } = await searchParams;
  const staticItem = pastoralMultiplicationsMock.find((candidate) => candidate.id === multiplicationId && candidate.state === "Em preparação");
  const isDraft = multiplicationId === "rascunho" && Boolean(cellId);

  let initial: StoredMultiplicationPreparation | undefined;
  if (staticItem && "startedOn" in staticItem) {
    initial = {
      id: staticItem.id,
      parentCellId: staticItem.parentCellId,
      startedOn: staticItem.startedOn,
      startedBy: "Não registrado nesta demonstração",
      state: "Em preparação",
      description: staticItem.description,
    };
  } else if (isDraft && cellId) {
    const today = new Date();
    const startedOn = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    const cell = churchCellsMock.find((item) => item.id === cellId);
    if (cell?.status === "Ativa") initial = {
      id: "rascunho",
      parentCellId: cell.id,
      startedOn,
      startedBy: "Usuário atual",
      state: "Em preparação",
      description: `A ${cell.name} está se preparando para uma nova multiplicação.`,
    };
  }

  return <div className={`${styles.directoryPage} ${managementStyles.page}`}>
    <Link className={styles.backToOverview} href={isDraft ? "/pastor/multiplicacoes/nova" : "/pastor/multiplicacoes"}>‹ {isDraft ? "Voltar para escolher a célula" : "Voltar para Multiplicações"}</Link>
    <PreparationFormClient multiplicationId={multiplicationId} initial={initial} cells={churchCellsMock} leaders={pastoralPeopleMock} genesisParticipants={genesisCellMock.participants} />
  </div>;
}
