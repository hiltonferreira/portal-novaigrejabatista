import Link from "next/link";
import { ContextTag } from "@/components/portal-patterns";
import pastoralStyles from "../../pastor.module.css";
import styles from "../discipleship-groups.module.css";

export default function NewDiscipleshipGroupPage() {
  return <main className={`${pastoralStyles.directoryPage} ${styles.page}`}>
    <Link className={pastoralStyles.backToOverview} href="/pastor/grupos-de-discipulado">‹ Voltar para Grupos de Discipulado</Link>
    <header className={styles.heading}><div><p className={styles.eyebrow}>Novo grupo</p><h1>Criar Grupo de Discipulado</h1><p>O grupo é criado no contexto da Rede formal do responsável e reúne Líderes e Líderes em Treinamento dessa Rede.</p></div></header>
    <section className={styles.card}><div className={styles.cardTop}><div><ContextTag>Contexto da Rede</ContextTag><h2>Rede formal do responsável</h2><p>Nesta primeira versão, a Rede é apresentada como contexto estrutural. Ela não representa toda a linhagem nem substitui a Supervisão.</p></div></div><div className={styles.meta}><div><span>Responsável</span><strong>Usuário atual</strong></div><div><span>Rede</span><strong>Definida pelo vínculo formal</strong></div><div><span>Participantes elegíveis</span><strong>Líderes e LT da Rede</strong></div></div></section>
    <section className={styles.card}><div className={styles.cardTop}><div><ContextTag>Estudos</ContextTag><h2>Conteúdo do grupo</h2><p>O responsável poderá utilizar um estudo recebido da liderança pastoral ou criar conteúdo específico para o próprio grupo.</p></div></div></section>
    <div className={styles.actions}><Link className="action-link secondary" href="/pastor/grupos-de-discipulado">Voltar</Link></div>
  </main>;
}
