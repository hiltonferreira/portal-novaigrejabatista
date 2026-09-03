import { ActionLink, PortalShell } from "@/components/portal-shell";
import { ContextHeader } from "@/components/context-header";
import { PageTitle } from "@/components/page-title";
import { ContextTag, ResponsibilityTags, SectionLabel } from "@/components/portal-patterns";
import { homeMock } from "@/data/home";
import { formatShortDate, mariaServiceAssignmentsMock } from "@/data/cell";
import Link from "next/link";
import styles from "./home.module.css";

function ChevronIcon() {
  return <svg className={styles.chevron} viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="m9 5 7 7-7 7" /></svg>;
}

export default function Home() {
  const wordAssignment = mariaServiceAssignmentsMock.find((assignment) => assignment.serviceFunction === "Palavra");

  return (
    <PortalShell className={styles.homeTheme}>
      <ContextHeader
        title={<PageTitle leading="Bom dia," accent={`${homeMock.personName}.`} />}
        secondaryLabel="Horário e local"
        secondaryActionStyle="button"
        primary={
          <>
            <strong>Você faz parte da célula {homeMock.cell.name}</strong>
            <ResponsibilityTags label="Suas responsabilidades" items={homeMock.responsibilities} />
          </>
        }
        secondary={
          <>
            <span>Encontros toda {homeMock.cell.weekday}, às {homeMock.cell.startTime}</span>
            <address>{homeMock.cell.address}</address>
            <a href={homeMock.cell.mapsUrl} target="_blank" rel="noopener noreferrer">Como chegar</a>
          </>
        }
      />

      <section className={styles.contextSection} aria-labelledby="minhas-atividades">
        <SectionLabel id="minhas-atividades">Minhas atividades</SectionLabel>
        <article className={`${styles.card} ${styles.actionCard}`} aria-labelledby="proximo-passo">
          <div className={styles.cardContext}>
            <ContextTag>Próximo passo</ContextTag>
            <strong>Secretaria da célula</strong>
          </div>
          <h3 id="proximo-passo">Prepare a comunicação do encontro de 08/09.</h3>
          <p>A escala já está definida. A comunicação do encontro está pronta para ser preparada.</p>
          <ActionLink href="/secretaria">Continuar</ActionLink>
        </article>
      </section>

      <div className={styles.secondaryGrid}>
        <section className={styles.contextSection} aria-labelledby="contexto-minha-celula">
          <SectionLabel id="contexto-minha-celula">Minha célula</SectionLabel>
          <article className={`${styles.card} ${styles.informationCard}`} aria-labelledby="proximo-encontro">
            <ContextTag>Próximo encontro</ContextTag>
            <p className={styles.metadata}>Terça-feira · 08/09 · 19h40</p>
            <h3 id="proximo-encontro">Lição 13</h3>
            <p className={styles.lessonTitle}>Uma vida guiada pelo Espírito</p>
            <dl className={styles.assignment}><div><dt>Sua participação</dt><dd>Boas-vindas e Avisos</dd></div></dl>
            <ActionLink href="/minha-celula" variant="secondary">Ver encontro</ActionLink>
          </article>
        </section>
        <section className={styles.contextSection} aria-labelledby="contexto-minha-jornada">
          <SectionLabel id="contexto-minha-jornada">Minha jornada</SectionLabel>
          <div className={styles.sideStack}>
            <article className={`${styles.card} ${styles.developmentCard}`} aria-labelledby="desenvolvimento">
              <div className={styles.cardContext}>
                <ContextTag>Desenvolvimento</ContextTag>
                <strong>Liderança</strong>
              </div>
              <h3 id="desenvolvimento">Você ministrará a Palavra no encontro de {wordAssignment ? formatShortDate(wordAssignment.meeting.dateIso) : ""}.</h3>
              <ActionLink href="/lideranca" variant="secondary">Ver preparação</ActionLink>
            </article>
            <div className={styles.journeySection}>
              <div className={styles.journeyList}>
                <Link href="/jornada-dna" aria-label="Abrir Jornada DNA, Cresça 2, aula 4 de 7"><span><strong>Jornada DNA</strong><small>Cresça 2 · Aula 4 de 7</small></span><ChevronIcon /></Link>
                <Link href="/grupo-de-discipulado" aria-label="Abrir Grupo de Discipulado, encontro em 15 de setembro às 20 horas"><span><strong>Grupo de Discipulado</strong><small>15/09 · 20h</small></span><ChevronIcon /></Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PortalShell>
  );
}
