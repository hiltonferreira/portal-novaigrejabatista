import Link from "next/link";
import { notFound } from "next/navigation";
import { ContextTag, StatusTag } from "@/components/portal-patterns";
import { traineeLeadersMock } from "@/data/leadership-development";
import styles from "../../pastor.module.css";
import traineeStyles from "../trainee-leaders.module.css";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", { day:"2-digit", month:"long", year:"numeric" });
export default async function Page({params}:{params:Promise<{traineeId:string}>}) {
 const {traineeId}=await params; const trainee=traineeLeadersMock.find((item)=>item.id===traineeId); if(!trainee) notFound();
 return <div className={`${styles.directoryPage} ${traineeStyles.page}`}>
  <Link className={styles.backToOverview} href="/pastor/lideres-em-treinamento">‹ Voltar para Líderes em Treinamento</Link>
  <header className={traineeStyles.heading}><div><p className={traineeStyles.eyebrow}>Acompanhamento</p><h1>{trainee.personName}</h1><p>Líder em Treinamento · {trainee.cellName}</p></div><StatusTag tone="progress">Em desenvolvimento</StatusTag></header>
  <article className={`${styles.overviewCard} ${traineeStyles.card}`}><ContextTag>Designação e Jornada DNA</ContextTag><dl className={traineeStyles.details}>
   <div><dt>Célula de desenvolvimento</dt><dd>{trainee.cellName}</dd></div><div><dt>Designada em</dt><dd>{dateFormatter.format(new Date(`${trainee.designatedOn}T12:00:00`))}</dd></div>
   <div><dt>Jornada DNA</dt><dd>{trainee.journey.completedModules} de {trainee.journey.totalModules} módulos concluídos</dd></div><div><dt>Contexto atual</dt><dd>{trainee.journey.currentModule}</dd></div>
  </dl><p className={traineeStyles.guidance}>O acompanhamento registra fatos do desenvolvimento. Não há score de prontidão, e a conclusão da Jornada DNA não promove automaticamente a pessoa a Líder.</p></article>
 </div>;
}
