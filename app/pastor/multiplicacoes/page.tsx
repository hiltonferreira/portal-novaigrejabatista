import Link from "next/link";
import { ContextTag, SectionBlock, StatusTag } from "@/components/portal-patterns";
import { getPastoralCell, pastoralMultiplicationsMock } from "@/data/pastoral-structure";
import styles from "../pastor.module.css";

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
    <div className={styles.directoryPage} data-pastoral-multiplications="page">
      <Link className={styles.backToOverview} href="/pastor">‹ Voltar para Visão Geral</Link>

      <SectionBlock id="multiplications-in-preparation" label="Em preparação">
        <div data-pastoral-multiplications="grid">
          {preparations.length ? preparations.map((item) => {
            const parentCell = getPastoralCell(item.parentCellId);
            return (
              <article className={styles.overviewCard} data-pastoral-multiplications="card" key={item.id}>
                <div data-pastoral-multiplications="card-header">
                  <ContextTag>Acompanhamento da multiplicação</ContextTag>
                  <StatusTag tone="progress">Em preparação</StatusTag>
                </div>
                <div data-pastoral-multiplications="identity">
                  <h2>{parentCell?.name ?? "Célula de origem"}</h2>
                  <p>{item.description}</p>
                </div>
                <dl data-pastoral-multiplications="details">
                  <div><dt>Célula de origem</dt><dd>{parentCell?.name ?? "Não registrada"}</dd></div>
                  <div><dt>Processo iniciado</dt><dd>{formatDate(item.startedOn)}</dd></div>
                  <div><dt>Futura liderança</dt><dd>Ainda não definida</dd></div>
                  <div><dt>Previsão</dt><dd>Ainda não definida</dd></div>
                  <div><dt>Nome futuro</dt><dd>Ainda não definido</dd></div>
                  <div><dt>Pessoas previstas</dt><dd>Ainda não registradas</dd></div>
                </dl>
                <details data-pastoral-multiplications="disclosure">
                  <summary className="action-link secondary">Ver preparação</summary>
                  <p>Durante a preparação, as pessoas permanecem vinculadas à célula de origem. A efetivação da multiplicação é que cria a célula-filha e atualiza as relações derivadas.</p>
                </details>
              </article>
            );
          }) : <article className={styles.overviewCard} data-pastoral-multiplications="empty"><ContextTag>Acompanhamento da multiplicação</ContextTag><p>Nenhuma multiplicação está em preparação neste momento.</p></article>}
        </div>
      </SectionBlock>

      <SectionBlock id="multiplication-history" label="Histórico de multiplicações">
        <article className={`${styles.overviewCard} ${styles.directoryCard}`} data-pastoral-multiplications="history">
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
