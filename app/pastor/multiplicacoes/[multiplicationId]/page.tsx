import Link from "next/link";
import { notFound } from "next/navigation";
import { ContextTag, StatusTag } from "@/components/portal-patterns";
import { genesisCellMock } from "@/data/cell";
import { getPastoralCell, pastoralMultiplicationsMock, pastoralPeopleMock } from "@/data/pastoral-structure";
import styles from "../../pastor.module.css";
import { PeopleSelector } from "./people-selector";
import managementStyles from "./preparation.module.css";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

function formatDate(date: string) {
  return dateFormatter.format(new Date(`${date}T12:00:00`));
}

const weekdays = ["segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira"] as const;

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ multiplicationId: string }>;
  searchParams: Promise<{ cellId?: string }>;
}) {
  const { multiplicationId } = await params;
  const { cellId } = await searchParams;
  const isDraft = multiplicationId === "rascunho";

  const item = pastoralMultiplicationsMock.find((candidate) => candidate.id === multiplicationId);
  if (!isDraft && (!item || !("startedOn" in item) || item.state !== "Em preparação")) notFound();

  const draftCell = isDraft && cellId ? getPastoralCell(cellId) : undefined;
  if (isDraft && (!draftCell || draftCell.status !== "Ativa")) notFound();

  const parentCell = isDraft ? draftCell : getPastoralCell(item!.parentCellId);
  const startedOn = isDraft
    ? new Date().toISOString().slice(0, 10)
    : (item as Extract<(typeof pastoralMultiplicationsMock)[number], { state: "Em preparação" }>).startedOn;
  const originName = parentCell?.name ?? "Célula de origem";
  const people = parentCell?.id === "cell-genesis" ? genesisCellMock.participants : [];

  return (
    <div className={`${styles.directoryPage} ${managementStyles.page}`}>
      <Link className={styles.backToOverview} href={isDraft ? "/pastor/multiplicacoes/nova" : "/pastor/multiplicacoes"}>
        ‹ {isDraft ? "Voltar para escolher a célula" : "Voltar para Multiplicações"}
      </Link>

      <header className={managementStyles.heading}>
        <div>
          <p className={managementStyles.eyebrow}>{isDraft ? "Nova preparação" : "Preparação da multiplicação"}</p>
          <h1>{originName}</h1>
          <p>Organize os dados previstos para a futura célula sem alterar os vínculos atuais durante a preparação.</p>
        </div>
        <StatusTag tone="progress">{isDraft ? "Rascunho" : "Em preparação"}</StatusTag>
      </header>

      <form className={managementStyles.form}>
        <section className={managementStyles.section}>
          <div className={managementStyles.sectionHeading}>
            <ContextTag>Processo</ContextTag>
            <h2>Dados da preparação</h2>
          </div>
          <div className={managementStyles.readonlyGrid}>
            <div><span>Célula de origem</span><strong>{originName}</strong></div>
            <div><span>Processo iniciado</span><strong>{formatDate(startedOn)}</strong></div>
            <div><span>Iniciado por</span><strong>{isDraft ? "Usuário atual" : "Não registrado nesta demonstração"}</strong></div>
          </div>
          <div className={managementStyles.fieldsGrid}>
            <label>Previsão da multiplicação<input type="date" name="expectedDate" /></label>
            <label className={managementStyles.fullField}>Observação<textarea name="notes" rows={4} placeholder="Registre informações relevantes para o acompanhamento pastoral." /></label>
          </div>
        </section>

        <section className={managementStyles.section}>
          <div className={managementStyles.sectionHeading}>
            <ContextTag>Futura célula</ContextTag>
            <h2>Configuração prevista</h2>
            <p>Estes dados descrevem a futura célula. Eles ainda não criam nem alteram uma célula ativa.</p>
          </div>
          <div className={managementStyles.fieldsGrid}>
            <label>Nome futuro<input type="text" name="futureName" placeholder="Nome da futura célula" /></label>
            <label>Futura liderança<select name="futureLeader" defaultValue=""><option value="">Selecionar pessoa</option>{pastoralPeopleMock.map((person) => <option value={person.id} key={person.id}>{person.name}</option>)}</select><small>A futura liderança deve ter a Jornada DNA concluída. O sistema não calcula prontidão.</small></label>
            <label>Dia da semana<select name="weekday" defaultValue=""><option value="">Selecionar dia</option>{weekdays.map((weekday) => <option value={weekday} key={weekday}>{weekday}</option>)}</select></label>
            <label>Horário<div className={managementStyles.timeField}><input type="time" name="time" /></div></label>
            <label>Local<input type="text" name="location" placeholder="Local previsto dos encontros" /></label>
            <label>Anfitrião<input type="text" name="host" placeholder="Nome do anfitrião" /></label>
          </div>
        </section>

        <section className={managementStyles.section}>
          <div className={managementStyles.sectionHeading}>
            <ContextTag>Pessoas previstas</ContextTag>
            <h2>Composição prevista</h2>
            <p>Durante a preparação, as pessoas selecionadas continuam vinculadas à célula de origem.</p>
          </div>
          <PeopleSelector people={people} originName={originName} />
          {people.length === 0 && <p className={managementStyles.dataNotice}>Ainda não há participantes demonstrativos cadastrados para esta célula.</p>}
        </section>

        <div className={managementStyles.actions}>
          <button className="action-link primary" type="button">{isDraft ? "Iniciar preparação" : "Salvar alterações"}</button>
          <p>Esta versão demonstra o fluxo e não persiste alterações.</p>
        </div>
      </form>

      {!isDraft && (
        <section className={`${managementStyles.section} ${managementStyles.effectuation}`}>
          <div className={managementStyles.sectionHeading}>
            <ContextTag>Efetivação da multiplicação</ContextTag>
            <h2>Concluir a preparação</h2>
            <p>A efetivação cria a célula-filha e consolida as relações da multiplicação. Ela será tratada em um fluxo separado de revisão e confirmação.</p>
          </div>
          <button className="action-link secondary" type="button">Efetivar multiplicação</button>
        </section>
      )}
    </div>
  );
}
