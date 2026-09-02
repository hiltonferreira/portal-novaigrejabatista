import { ActionLink, PortalShell } from "@/components/portal-shell";
import { homeMock } from "@/data/home";
import Link from "next/link";
import styles from "./home.module.css";

function ChevronIcon() {
  return <svg className={styles.chevron} viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="m9 5 7 7-7 7" /></svg>;
}

export default function Home() {
  return (
    <PortalShell className={styles.homeTheme}>
      <header className={styles.opening}>
        <h1>Bom dia, {homeMock.personName}.</h1>
        <div className={styles.cellContext}>
          <div className={styles.cellIdentity}>
            <strong>Você faz parte da célula {homeMock.cell.name}</strong>
            <span>Encontros toda {homeMock.cell.weekday}, às {homeMock.cell.startTime}</span>
          </div>
          <div className={styles.cellLocation}>
            <address>{homeMock.cell.address}</address>
            <a href={homeMock.cell.mapsUrl} target="_blank" rel="noopener noreferrer">Como chegar</a>
          </div>
        </div>
      </header>

      <section className={`${styles.card} ${styles.actionCard}`} aria-labelledby="proximo-passo">
        <div className={styles.eyebrow}><span>Próximo passo</span><strong>Secretaria</strong></div>
        <h1 id="proximo-passo">Prepare a comunicação do encontro de 08/09.</h1>
        <p>A escala já está definida. A comunicação do encontro está pronta para ser preparada.</p>
        <ActionLink href="/secretaria">Continuar</ActionLink>
      </section>

      <div className={styles.secondaryGrid}>
        <section className={`${styles.card} ${styles.informationCard}`} aria-labelledby="proximo-encontro">
          <div className={styles.eyebrow}><span>Próximo encontro da célula</span></div>
          <p className={styles.metadata}>Terça-feira · 08/09 · 19h40</p>
          <h2 id="proximo-encontro">Lição 13</h2>
          <p className={styles.lessonTitle}>Uma vida guiada pelo Espírito</p>
          <dl className={styles.assignment}><div><dt>Sua participação</dt><dd>Boas-vindas e Avisos</dd></div></dl>
          <ActionLink href="/minha-celula" variant="secondary">Ver encontro</ActionLink>
        </section>
        <div className={styles.sideStack}>
          <section className={`${styles.card} ${styles.developmentCard}`} aria-labelledby="desenvolvimento">
            <div className={styles.eyebrow}><span>Desenvolvimento</span><strong>Liderança</strong></div>
            <h2 id="desenvolvimento">Você ministrará a Palavra no encontro de 15/09.</h2>
            <ActionLink href="/lideranca" variant="secondary">Ver preparação</ActionLink>
          </section>
          <section className={styles.journeySection} aria-labelledby="minha-jornada">
            <div className={styles.eyebrow}><span id="minha-jornada">Minha jornada</span></div>
            <div className={styles.journeyList}>
              <Link href="/jornada-dna" aria-label="Abrir Jornada DNA, Cresça 2, aula 4 de 7"><span><strong>Jornada DNA</strong><small>Cresça 2 · Aula 4 de 7</small></span><ChevronIcon /></Link>
              <Link href="/grupo-de-discipulado" aria-label="Abrir Grupo de Discipulado, encontro em 15 de setembro às 20 horas"><span><strong>Grupo de Discipulado</strong><small>15/09 · 20h</small></span><ChevronIcon /></Link>
            </div>
          </section>
        </div>
      </div>
    </PortalShell>
  );
}
