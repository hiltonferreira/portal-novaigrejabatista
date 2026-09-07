import Link from "next/link";
import { ContextTag, StatusTag } from "@/components/portal-patterns";
import { discipleshipGroupsMock } from "@/data/discipleship-groups";
import styles from "./discipleship-groups.module.css";

export default function DiscipleshipGroupsPage() {
  return <main className={styles.page}>
    <Link className={styles.back} href="/pastor">← Voltar para Liderança Pastoral</Link>
    <header className={styles.heading}>
      <div><p className={styles.eyebrow}>Desenvolvimento de liderança</p><h1>Grupos de Discipulado</h1><p>Acompanhe grupos de Líderes e Líderes em Treinamento vinculados à Rede formal de cada responsável.</p></div>
      <Link className="action-link primary" href="/pastor/grupos-de-discipulado/novo">Criar grupo</Link>
    </header>
    <section className={styles.section}>
      <p className={styles.eyebrow}>Grupos ativos</p>
      <div className={styles.list}>{discipleshipGroupsMock.map((group) => <article className={styles.card} key={group.id}>
        <div className={styles.cardTop}><div><ContextTag>{group.networkName}</ContextTag><h2>{group.name}</h2><p>{group.leaderName} · {group.leaderRole}</p></div><StatusTag tone="progress">{group.status}</StatusTag></div>
        <div className={styles.meta}><div><span>Rede formal</span><strong>{group.networkCells.join(" + ")}</strong></div><div><span>Participantes</span><strong>{group.participants.length} Líderes / LT</strong></div><div><span>Estudos</span><strong>{group.studies.length} conteúdo em uso</strong></div></div>
        <div className={styles.actions}><Link className="action-link secondary" href={`/pastor/grupos-de-discipulado/${group.id}`}>Ver grupo</Link></div>
      </article>)}</div>
    </section>
  </main>;
}
