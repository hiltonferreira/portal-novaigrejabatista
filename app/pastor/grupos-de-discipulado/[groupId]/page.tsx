import Link from "next/link";
import { notFound } from "next/navigation";
import { ContextTag, SectionBlock, StatusTag } from "@/components/portal-patterns";
import { discipleshipGroupsMock } from "@/data/discipleship-groups";
import pastoralStyles from "../../pastor.module.css";
import styles from "../discipleship-groups.module.css";

type GroupSection = "visao-geral" | "participantes" | "estudos";

export default async function DiscipleshipGroupPage({ params, searchParams }: { params: Promise<{ groupId: string }>; searchParams: Promise<{ secao?: string }> }) {
  const { groupId } = await params;
  const { secao } = await searchParams;
  const group = discipleshipGroupsMock.find((item) => item.id === groupId);
  if (!group) notFound();
  const active: GroupSection = secao === "participantes" || secao === "estudos" ? secao : "visao-geral";
  const href = (section: GroupSection) => `/pastor/grupos-de-discipulado/${group.id}?secao=${section}`;
  const currentStudy = group.studies[0];

  return <main className={`${pastoralStyles.directoryPage} ${styles.page}`}>
    <Link className={pastoralStyles.backToOverview} href="/pastor/grupos-de-discipulado">‹ Voltar para Grupos de Discipulado</Link>
    <header className={styles.heading}><div><p className={styles.eyebrow}>Grupo de discipulado</p><h1>Grupo de Discipulado</h1><p>{group.networkName} · {group.leaderName} · {group.leaderRole}</p></div><StatusTag tone="progress">{group.status}</StatusTag></header>
    <nav className={pastoralStyles.cellsViewNavigation} aria-label="Áreas do Grupo de Discipulado">
      <Link aria-current={active === "visao-geral" ? "page" : undefined} href={href("visao-geral")}>Visão Geral</Link>
      <Link aria-current={active === "participantes" ? "page" : undefined} href={href("participantes")}>Participantes</Link>
      <Link aria-current={active === "estudos" ? "page" : undefined} href={href("estudos")}>Estudos</Link>
    </nav>

    {active === "visao-geral" && <>
      <SectionBlock id="discipleship-network" label="Rede formal">
        <section className={styles.card}><div className={styles.cardTop}><div><ContextTag>Contexto da Rede</ContextTag><h2>{group.networkName}</h2><p>Rede formal vinculada ao responsável pelo Grupo de Discipulado.</p></div></div><div className={styles.meta}><div><span>Células vinculadas</span><strong>{group.networkCells.length} células</strong><div className={styles.chips}>{group.networkCells.map((cell)=><span key={cell}>{cell}</span>)}</div></div><div><span>Responsável</span><strong>{group.leaderName}</strong><small>{group.leaderRole}</small></div><div><span>Participantes</span><strong>{group.participants.length} participantes</strong><small>Líderes e Líderes em Treinamento</small></div></div></section>
      </SectionBlock>
      <SectionBlock id="discipleship-participants-overview" label="Participantes" action={<Link className={pastoralStyles.sectionTextAction} href={href("participantes")}>Ver participantes</Link>}>
        <div className={styles.compactPeople}>{group.participants.slice(0,3).map((person)=><div className={styles.personRow} key={person.name}><div><strong>{person.name}</strong><span>{person.cellName}</span></div><StatusTag tone="neutral">{person.role}</StatusTag></div>)}</div>
      </SectionBlock>
      <SectionBlock id="discipleship-current-study" label="Estudo atual" action={<Link className={pastoralStyles.sectionTextAction} href={href("estudos")}>Ver estudos</Link>}>
        {currentStudy ? <article className={styles.studyCard}><div><ContextTag>{currentStudy.source}</ContextTag><h2>{currentStudy.title}</h2><p>{currentStudy.source === "Pastoral" ? "Conteúdo recebido da liderança pastoral para aplicação no grupo." : "Conteúdo criado especificamente pelo responsável deste grupo."}</p></div><Link className="action-link secondary" href={href("estudos")}>Abrir estudo</Link></article> : <div className={styles.empty}>Nenhum estudo definido para este grupo.</div>}
      </SectionBlock>
    </>}

    {active === "participantes" && <SectionBlock id="discipleship-participants" label="Participantes" action={<button className="action-link secondary" type="button">Gerenciar participantes</button>}>
      <div className={styles.sectionIntro}><h2>Líderes e LT da Rede</h2><p>O gerenciamento deve considerar somente Líderes e Líderes em Treinamento pertencentes à Rede formal deste responsável.</p></div>
      <div className={styles.compactPeople}>{group.participants.map((person)=><div className={styles.personRow} key={person.name}><div><strong>{person.name}</strong><span>{person.cellName}</span></div><StatusTag tone="neutral">{person.role}</StatusTag></div>)}</div>
    </SectionBlock>}

    {active === "estudos" && <SectionBlock id="discipleship-studies" label="Estudos" action={<button className="action-link primary" type="button">Adicionar estudo</button>}>
      <div className={styles.sectionIntro}><h2>Conteúdo do Grupo de Discipulado</h2><p>Utilize um estudo recebido da liderança pastoral ou crie conteúdo específico para este grupo.</p></div>
      {currentStudy && <article className={styles.studyCard}><div><ContextTag>{currentStudy.source}</ContextTag><h2>{currentStudy.title}</h2><p>{currentStudy.source === "Pastoral" ? "Conteúdo recebido da liderança pastoral para aplicação no grupo." : "Conteúdo criado especificamente pelo responsável deste grupo."}</p></div><span className={styles.currentLabel}>Estudo atual</span></article>}
      <div className={styles.studyChoices}><div><strong>Usar estudo pastoral</strong><p>Selecionar um conteúdo disponibilizado pela liderança pastoral.</p></div><div><strong>Criar estudo para este grupo</strong><p>Criar conteúdo específico para o Grupo de Discipulado.</p></div></div>
    </SectionBlock>}
  </main>;
}
