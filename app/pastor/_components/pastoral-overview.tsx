"use client";

import Link from "next/link";
import { ContextTag, SectionBlock, StatusTag } from "@/components/portal-patterns";
import { pastoralStudiesMock, studySchedulesMock } from "@/data/pastoral-studies";
import { addCalendarWeeks, formatLocalDateKey, formatStudyWeek, startOfCalendarWeek } from "@/data/temporal-context";
import styles from "../pastor.module.css";

const churchContexts = [
  { title: "Células", description: "Acompanhe as células e sua estrutura de liderança.", href: "/pastor/celulas" },
  { title: "Supervisão", description: "Acompanhe supervisores, líderes e células sob supervisão.", href: "/pastor/supervisao" },
  { title: "Coordenação", description: "Acompanhe a estrutura das coordenações.", href: "/pastor/coordenacao" },
  { title: "Multiplicações", description: "Acompanhe os processos de multiplicação das células.", href: "/pastor/multiplicacoes" },
] as const;

const leadershipContexts = [
  { title: "Jornada DNA", description: "Acompanhe o percurso completo de formação.", href: "/jornada-dna" },
  { title: "Líderes em Treinamento", description: "Acompanhe pessoas designadas e seu desenvolvimento.", href: "/pastor/lideres-em-treinamento" },
  { title: "Grupo de Discipulado", description: "Acompanhe o espaço de discipulado de Líderes e Líderes em Treinamento.", href: "/grupo-de-discipulado" },
  { title: "Trajetória de Liderança", description: "Consulte os contextos de desenvolvimento, processos e designações." },
] as const;

function Chevron() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7" /></svg>;
}

function ContextRows({ items }: { items: readonly { title: string; description: string; href?: string }[] }) {
  return <ul className={styles.contextRows}>
    {items.map((item) => <li key={item.title}>
      {item.href ? <Link href={item.href}><span><strong>{item.title}</strong><small>{item.description}</small></span><Chevron /></Link>
        : <div className={styles.contextRowPending}><span><strong>{item.title}</strong><small>{item.description}</small></span></div>}
    </li>)}
  </ul>;
}

export function PastoralOverview() {
  const currentWeekStart = formatLocalDateKey(startOfCalendarWeek(new Date()));
  const nextWeekStart = addCalendarWeeks(currentWeekStart, 1);
  const currentSchedule = studySchedulesMock.find((schedule) => schedule.weekStart === currentWeekStart);
  const nextSchedule = studySchedulesMock.find((schedule) => schedule.weekStart === nextWeekStart);
  const currentStudy = pastoralStudiesMock.find((study) => study.id === currentSchedule?.studyId);
  const hasNextAction = !nextSchedule;

  return <div className={`${styles.pastoralOverview}${hasNextAction ? ` ${styles.pastoralOverviewWithAction}` : ""}`}>
      {hasNextAction ? <SectionBlock className={styles.nextActionSection} id="next-pastoral-action" label="Próxima ação">
        <article className={`${styles.overviewCard} ${styles.priorityCard}`}>
          <ContextTag>Estudo oficial</ContextTag>
          <h2>Programe o estudo da próxima semana.</h2>
          <p><span>A próxima semana ainda não possui uma lição oficial programada para as células.</span><strong>{formatStudyWeek(nextWeekStart)}</strong></p>
          <Link className="action-link primary" href="/pastor/estudos">Programar estudo</Link>
        </article>
      </SectionBlock> : null}

      <SectionBlock className={styles.studySection} id="current-pastoral-study" label="Estudo da semana">
        <article className={styles.overviewCard}>
          <ContextTag>Conteúdo oficial</ContextTag>
          {currentStudy && currentSchedule ? <>
            <h2>Lição {currentStudy.lessonNumber} · {currentStudy.title}</h2>
            <p><strong>{currentStudy.series}</strong><span>{currentStudy.baseReference}</span><span>{formatStudyWeek(currentSchedule.weekStart)}</span></p>
            {currentStudy.pdf.objectUrl
              ? <a className={`action-link ${styles.primaryNavy}`} href={currentStudy.pdf.objectUrl} target="_blank" rel="noopener noreferrer">Visualizar PDF</a>
              : <StatusTag tone="neutral">PDF indisponível nesta sessão</StatusTag>}
          </> : <div className={styles.informativeState}><p>Nenhum estudo oficial está programado para esta semana.</p><strong>{formatStudyWeek(currentWeekStart)}</strong><Link className="action-link secondary" href="/pastor/estudos">Consultar estudos</Link></div>}
        </article>
      </SectionBlock>

    <SectionBlock className={styles.leadershipSection} id="leadership-development" label="Desenvolvimento de liderança">
      <article className={`${styles.overviewCard} ${styles.compactOverviewCard}`}><ContextTag>Formação e acompanhamento</ContextTag><ContextRows items={leadershipContexts} /></article>
    </SectionBlock>

    <SectionBlock className={styles.churchSection} id="church-follow-up" label="Acompanhamento da igreja">
      <article className={`${styles.overviewCard} ${styles.compactOverviewCard}`}><ContextTag>Células e liderança</ContextTag><ContextRows items={churchContexts} /></article>
    </SectionBlock>
  </div>;
}
