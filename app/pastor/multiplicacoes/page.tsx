import Link from "next/link";
import { ContextTag, SectionBlock, StatusTag } from "@/components/portal-patterns";
import { getPastoralCell, pastoralMultiplicationsMock } from "@/data/pastoral-structure";
import styles from "../pastor.module.css";
import multiplicationStyles from "./multiplicacoes.module.css";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

function formatDate(date: string) {
  return dateFormatter.format(new Date(`${date}T12:00:00`));
}

export default function Page() {
  const preparations = pastoralMultiplicationsMock.filter((item) => item.state === "Em preparação");
  const history = pastoralMultiplicationsMock.filter((item) => item.state === "Efetivada");

  return (
    <div className={`${styles.directoryPage} ${multiplicationStyles.page}`}>
      <Link className={styles.backToOverview} href="/pastor">‹ Voltar para Visão Geral</Link>

      <SectionBlock id="multiplications-in-preparation" label="Em preparação">
        <div className={multiplicationStyles.grid}>
          {preparations.length ? preparations.map((item) => {
            const parentCell = getPastoralCell(item.parentCellId);
            return (
              <article className={`${styles.overviewCard} ${multiplicationStyles.card}`} key={item.id}>
                <div className={multiplicationStyles.cardHeader}>
                  <ContextTag>Acompanhamento da multiplicação</ContextTag>
                  <StatusTag tone="progress">Em preparação</StatusTag>
                </div>
                <div className={multiplicationStyles.identity}>
                  <h2>{parentCell?.name ?? "Célula de origem"}</h2>
                  <p>{item.description}</p>
                </div>
                <dl className={multiplicationStyles.details}>
                  <div><dt>Célula de origem</dt><dd>{parentCell?.name ?? "Não registrada"}</dd></div>
                  <div><dt>Processo iniciado</dt><dd>{formatDate(item.startedOn)}</dd></div>
                  <div><dt>Futura liderança</dt><dd>Ainda não definida</dd></div>
                  <div><dt>Previsão</dt><dd>Ainda não definida</dd></div>
                  <div><dt>Nome futuro</dt><dd>Ainda não definido</dd></div>
                  <div><dt>Pessoas previstas</dt><dd>Ainda não registradas</dd></div>
                </dl>
                <details className={multiplicationStyles.disclosure}>
                  <summary className="action-link secondary">Ver preparação</summary>
                  <p>Durante a preparação, as pessoas permanecem vinculadas à célula de origem. A efetivação da multiplicação é que cria a célula-filha e atualiza as relações derivadas.</p>
                </details>
              </article>
            );
          }) : <article className={`${styles.overviewCard} ${multiplicationStyles.card}`}><ContextTag>Acompanhamento da multiplicação</ContextTag><p>Nenhuma multiplicação está em preparação neste momento.</p></article>}
        </div>
      </SectionBlock>

      <SectionBlock id="multiplication-history" label="Histórico de multiplicações">
        <article className={`${styles.overviewCard} ${styles.directoryCard} ${multiplicationStyles.history}`}>
          <ContextTag>Multiplicações efetivadas</ContextTag>
          <ul className={styles.directoryList}>
            {history.map((item) => {
              if (!("childCellId" in item)) return null;
              const parentCell = getPastoralCell(item.parentCellId);
              const childCell = getPastoralCell(item.childCellId);
              return (
                <li key={item.id}>
                  <div>
                    <h2>{parentCell?.name ?? "Célula de origem"} → {childCell?.name ?? "Célula-filha"}</h2>
                    <p><span>Efetivada em {formatDate(item.occurredOn)}</span></p>
                  </div>
                  <StatusTag tone="success">Efetivada</StatusTag>
                </li>
              );
            })}
          </ul>
        </article>
      </SectionBlock>
    </div>
  );
}
