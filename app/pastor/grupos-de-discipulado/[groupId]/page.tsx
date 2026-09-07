import Link from "next/link";
import { notFound } from "next/navigation";
import { ContextTag, StatusTag } from "@/components/portal-patterns";
import { discipleshipGroupsMock } from "@/data/discipleship-groups";
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

  return <main className={styles.page}>
    <Link className={styles.back} href="/pastor/grupos-de-discipulado">← Voltar para Grupos de Discipulado</Link>
    <header className={styles.heading}><div><p className={styles.eyebrow}>Grupo de discipulado</p><h1>Grupo de Discipulado</h1><p>{group.networkName} · {group.leaderName} · {group.leaderRole}</p></div><StatusTag tone="progress">{group.status}</StatusTag></header>
    <nav className={styles.tabs} aria-label="Áreas do Grupo de Discipulado">
      <Link className={active === "visao-geral" ? styles.activeTab : undefined} href={href("visao-geral")}>Visão Geral</Link>
      <Link className={active === "participantes" ? styles.activeTab : undefined} href={href("participantes")}>Participantes</Link>
      <Link className={active === "estudos" ? styles.activeTab : undefined} href={href("estudos")}>Estudos</Link>
    </nav>

    {active === "visao-geral" && <>
      <section className={styles.card}><div className={styles.cardTop}><div><ContextTag>Rede formal</ContextTag><h2>{group.networkName}</h2><p>Rede formal vinculada ao responsável pelo Grupo de Discipulado.</p></div></div><div className={styles.meta}><div><span>Células vinculadas</span><strong>{group.networkCells.length} células</strong><div className={styles.chips}>{group.networkCells.map((cell)=><span key={cell}>{cell}</span>)}</div></div><div><span>Responsável</span><strong>{group.leaderName}</strong><small>{group.leaderRole}</small></div><div><span>Participantes</span><strong>{group.participants.length} participantes</strong><small>Líderes e Líderes em Treinamento</small></div></div></section>
      <section className={styles.section}><div className={styles.sectionTitle}><p className={styles.eyebrow}>Participantes</p><Link href={href("participantes")}>Ver participantes</Link></div><div className={styles.compactPeople}>{group.participants.slice(0,3).map((person)=><div className={styles.personRow} key={person.name}><div><strong>{person.name}</strong><span>{person.cellName}</span></div><StatusTag tone="neutral">{person.role}</StatusTag></div>)}</div></section>
      <section className={styles.section}><div className={styles.sectionTitle}><p className={styles.eyebrow}>Estudo atual</p><Link href={href("estudos")}>Ver estudos</Link></div>{currentStudy ? <article className={styles.studyCard}><div><ContextTag>{currentStudy.source}</ContextTag><h2>{currentStudy.title}</h2><p>{currentStudy.source === "Pastoral" ? "Conteúdo recebido da liderança pastoral para aplicação no grupo." : "Conteúdo criado especificamente pelo responsável deste grupo."}</p></div><Link className="action-link secondary" href={href("estudos")}>Abrir estudo</Link></article> : <div className={styles.empty}>Nenhum estudo definido para este grupo.</div>}</section>
    </>}

    {active === "participantes" && <section className={styles.section}><div className={styles.sectionTitle}><div><p className={styles.eyebrow}>Participantes</p><h2>Líderes e LT da Rede</h2></div><button className="action-link secondary" type="button">Gerenciar participantes</button></div><div className={styles.compactPeople}>{group.participants.map((person)=><div className={styles.personRow} key={person.name}><div><strong>{person.name}</strong><span>{person.cellName}</span></div><StatusTag tone="neutral">{person.role}</StatusTag></div>)}</div><p className={styles.helper}>O gerenciamento deve considerar somente Líderes e Líderes em Treinamento pertencentes à Rede formal deste responsável.</p></section>}

    {active === "estudos" && <section className={styles.section}><div className={styles.sectionTitle}><div><p className={styles.eyebrow}>Estudos</p><h2>Conteúdo do Grupo de Discipulado</h2></div><button className="action-link primary" type="button">Adicionar estudo</button></div>{currentStudy && <article className={styles.studyCard}><div><ContextTag>{currentStudy.source}</ContextTag><h2>{currentStudy.title}</h2><p>{currentStudy.source === "Pastoral" ? "Conteúdo recebido da liderança pastoral para aplicação no grupo." : "Conteúdo criado especificamente pelo responsável deste grupo."}</p></div><span className={styles.currentLabel}>Estudo atual</span></article>}<div className={styles.studyChoices}><div><strong>Usar estudo pastoral</strong><p>Selecionar um conteúdo disponibilizado pela liderança pastoral.</p></div><div><strong>Criar estudo para este grupo</strong><p>Criar conteúdo específico para o Grupo de Discipulado.</p></div></div></section>}
  </main>;
}
