import Link from "next/link";
import { notFound } from "next/navigation";
import { ContextTag, StatusTag } from "@/components/portal-patterns";
import { discipleshipGroupsMock } from "@/data/discipleship-groups";
import styles from "../discipleship-groups.module.css";

export default async function DiscipleshipGroupPage({ params }: { params: Promise<{ groupId: string }> }) {
  const { groupId } = await params;
  const group = discipleshipGroupsMock.find((item) => item.id === groupId);
  if (!group) notFound();
  return <main className={styles.page}>
    <Link className={styles.back} href="/pastor/grupos-de-discipulado">← Voltar para Grupos de Discipulado</Link>
    <header className={styles.heading}><div><p className={styles.eyebrow}>Grupo de discipulado</p><h1>{group.name}</h1><p>{group.leaderName} · {group.leaderRole}</p></div><StatusTag tone="progress">{group.status}</StatusTag></header>
    <section className={styles.card}><div className={styles.cardTop}><div><ContextTag>Visão Geral</ContextTag><h2>Rede vinculada</h2><p>O grupo acompanha Líderes e LT da Rede formal do responsável.</p></div></div><div className={styles.meta}><div><span>Rede</span><strong>{group.networkName}</strong></div><div><span>Células da Rede</span><strong>{group.networkCells.join(" + ")}</strong></div><div><span>Responsável</span><strong>{group.leaderName}</strong></div></div></section>
    <section className={styles.section}><p className={styles.eyebrow}>Participantes</p><div className={styles.list}>{group.participants.map((person)=><article className={styles.card} key={person.name}><div className={styles.cardTop}><div><h2>{person.name}</h2><p>{person.role} · {person.cellName}</p></div><StatusTag tone="neutral">{person.role}</StatusTag></div></article>)}</div></section>
    <section className={styles.section}><p className={styles.eyebrow}>Estudos</p><div className={styles.list}>{group.studies.map((study)=><article className={styles.card} key={study.title}><div className={styles.cardTop}><div><ContextTag>{study.source}</ContextTag><h2>{study.title}</h2><p>{study.source === "Pastoral" ? "Conteúdo recebido da liderança pastoral para aplicação no grupo." : "Conteúdo criado especificamente pelo responsável deste grupo."}</p></div></div></article>)}</div></section>
  </main>;
}
