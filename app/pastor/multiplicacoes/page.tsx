import Link from "next/link";
import { ContextTag, SectionBlock, StatusTag } from "@/components/portal-patterns";
import { churchCellsMock } from "@/data/cell";
import { getPastoralCell, pastoralMultiplicationsMock, pastoralPeopleMock } from "@/data/pastoral-structure";
import type { StoredMultiplicationPreparation } from "@/lib/test-persistence";
import styles from "../pastor.module.css";
import multiplicationStyles from "./multiplicacoes.module.css";
import { MultiplicationPreparationsClient } from "./multiplication-preparations-client";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
function formatDate(date: string) { return dateFormatter.format(new Date(`${date}T12:00:00`)); }

export default function Page() {
  const preparations: StoredMultiplicationPreparation[] = pastoralMultiplicationsMock.filter((item) => item.state === "Em preparação").map((item) => ({
    id: item.id,
    parentCellId: item.parentCellId,
    startedOn: item.startedOn,
    startedBy: "Não registrado nesta demonstração",
    state: "Em preparação",
    description: item.description,
  }));
  const history = pastoralMultiplicationsMock.filter((item) => item.state === "Efetivada");

  return <div className={`${styles.directoryPage} ${multiplicationStyles.page}`}>
    <Link className={styles.backToOverview} href="/pastor">‹ Voltar para Visão Geral</Link>
    <div className={multiplicationStyles.pageIntro}><div><p className={multiplicationStyles.eyebrow}>Multiplicações</p><h1>Acompanhe e inicie preparações</h1><p>Visualize processos em andamento e inicie uma nova preparação definindo primeiro a célula de origem.</p></div><Link className="action-link primary" href="/pastor/multiplicacoes/nova">Iniciar preparação</Link></div>
    <SectionBlock id="multiplications-in-preparation" label="Em preparação"><MultiplicationPreparationsClient initial={preparations} cells={churchCellsMock} people={pastoralPeopleMock} /></SectionBlock>
    <SectionBlock id="multiplication-history" label="Histórico de multiplicações"><article className={`${styles.overviewCard} ${styles.directoryCard} ${multiplicationStyles.history}`}><ContextTag>Multiplicações efetivadas</ContextTag><ul className={styles.directoryList}>{history.map((item) => {
      if (!("childCellId" in item)) return null;
      const parentCell = getPastoralCell(item.parentCellId); const childCell = getPastoralCell(item.childCellId);
      return <li key={item.id}><div><h2>{parentCell?.name ?? "Célula de origem"} → {childCell?.name ?? "Célula-filha"}</h2><p><span>Efetivada em {formatDate(item.occurredOn)}</span></p></div><StatusTag tone="success">Efetivada</StatusTag></li>;
    })}</ul></article></SectionBlock>
  </div>;
}
