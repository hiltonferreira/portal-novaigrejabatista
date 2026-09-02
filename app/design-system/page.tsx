import type { Metadata } from "next";
import styles from "./design-system.module.css";

export const metadata: Metadata = {
  title: "Laboratório de Design System",
  description: "Laboratório visual interno do Portal Nova Igreja Batista.",
};

const colors = [
  { name: "Navy", token: "--ds-navy", value: "#060749" },
  { name: "Marfim", token: "--ds-ivory", value: "#EBEBDF" },
  { name: "Azul-gray", token: "--ds-blue-gray", value: "#A8AFB7" },
  { name: "Laranja", token: "--ds-orange", value: "#FF7F40" },
  { name: "Laranja soft", token: "--ds-orange-soft", value: "#ff9560" },
  { name: "Azul-luz", token: "--ds-light-blue", value: "#7d9bd4" },
];

const neutrals = [
  { name: "Background", token: "--ds-background", value: "#F6F5EF" },
  { name: "Surface", token: "--ds-surface", value: "#FFFEF9" },
  { name: "Text", token: "--ds-text", value: "#17172E" },
  { name: "Muted text", token: "--ds-muted", value: "#626570" },
  { name: "Border", token: "--ds-border", value: "#D8D8CF" },
  { name: "Hover", token: "--ds-hover", value: "#E6E5DB" },
  { name: "Focus", token: "--ds-focus", value: "#5276BC" },
];

type IconName = "home" | "cell" | "journey" | "more" | "people" | "calendar" | "service" | "profile" | "chevron";

function Icon({ name }: { name: IconName }) {
  const paths: Record<IconName, React.ReactNode> = {
    home: <><path d="M3.5 10.5 12 3l8.5 7.5"/><path d="M5.5 9v11h13V9M9 20v-6h6v6"/></>,
    cell: <><path d="M4 10.5 12 4l8 6.5v8a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5z"/><path d="M8.5 14.5c1.8-1.7 5.2-1.7 7 0"/></>,
    journey: <><circle cx="12" cy="12" r="8"/><path d="M12 7v5l3 2"/></>,
    more: <><circle cx="5" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1" fill="currentColor" stroke="none"/></>,
    people: <><circle cx="9" cy="9" r="3"/><circle cx="17" cy="10" r="2.5"/><path d="M3.5 20c.4-4 2.2-6 5.5-6s5.1 2 5.5 6M14 15c3-.4 5 .9 6 4"/></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="1"/><path d="M7 3v4M17 3v4M3 10h18"/></>,
    service: <><path d="M5 4h14v16H5z"/><path d="m8 12 2.5 2.5L16 9"/></>,
    profile: <><circle cx="12" cy="8" r="3.5"/><path d="M5 21c.5-5 2.8-7.5 7-7.5S18.5 16 19 21"/></>,
    chevron: <path d="m9 5 7 7-7 7" />,
  };
  return <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

function Section({ number, eyebrow, title, intro, children }: { number: string; eyebrow: string; title: string; intro?: string; children: React.ReactNode }) {
  return (
    <section className={styles.section} aria-labelledby={`section-${number}`}>
      <header className={styles.sectionHeader}>
        <span className={styles.sectionNumber}>{number}</span>
        <div><p className={styles.eyebrow}>{eyebrow}</p><h2 id={`section-${number}`}>{title}</h2>{intro ? <p className={styles.sectionIntro}>{intro}</p> : null}</div>
      </header>
      {children}
    </section>
  );
}

export default function DesignSystemPage() {
  return (
    <main className={styles.lab}>
      <header className={styles.hero}>
        <p className={styles.eyebrow}>Portal Nova Igreja Batista</p>
        <h1>Laboratório de<br />Design System</h1>
        <p>Fundamentos e componentes para uma experiência digital que preserva a linguagem institucional da Nova Igreja Batista.</p>
        <dl className={styles.heroMeta}><div><dt>Status</dt><dd>Em validação</dd></div><div><dt>Direção</dt><dd>Editorial · Institucional · Mobile-first</dd></div></dl>
      </header>

      <Section number="01" eyebrow="Fundamentos" title="Cores que sustentam a experiência" intro="A paleta institucional permanece intacta. Os neutros abaixo apenas dão suporte à leitura e à interação.">
        <div className={styles.colorGroup}>
          <h3>Paleta institucional</h3>
          <div className={styles.swatchGrid}>{colors.map((color) => <article className={styles.swatch} key={color.token}><span style={{ background: `var(${color.token})` }} /><div><strong>{color.name}</strong><code>{color.value}</code><small>{color.token}</small></div></article>)}</div>
        </div>
        <div className={styles.colorGroup}>
          <h3>Neutros funcionais</h3>
          <div className={styles.swatchGrid}>{neutrals.map((color) => <article className={styles.swatch} key={color.token}><span style={{ background: `var(${color.token})` }} /><div><strong>{color.name}</strong><code>{color.value}</code><small>{color.token}</small></div></article>)}</div>
        </div>
      </Section>

      <Section number="02" eyebrow="Tipografia" title="Voz editorial e acolhedora">
        <div className={styles.typeSpecimens}>
          <div><small>Título de página</small><p className={styles.typePage}>Minha vida na<br />Nova Igreja Batista</p></div>
          <div><small>Título de seção</small><p className={styles.typeSection}>O que vem por aí</p></div>
          <div><small>Título de card</small><p className={styles.typeCard}>Preparar a comunicação do próximo encontro.</p></div>
          <div><small>Corpo</small><p className={styles.typeBody}>Uma experiência que ajuda cada pessoa a compreender seu contexto e seu próximo passo.</p></div>
          <div><small>Texto secundário</small><p className={styles.typeMuted}>Terça-feira · 08/09 · 19h40</p></div>
          <div><small>Chapéu / eyebrow</small><p className={styles.eyebrow}>Próximo encontro</p></div>
          <div><small>Label de formulário</small><p className={styles.typeLabel}>Nome completo</p></div>
          <div><small>Link</small><a className={styles.textLink} href="#botoes">Conhecer componentes</a></div>
          <div><small>Texto de botão</small><span className={styles.buttonText}>Continuar</span></div>
        </div>
      </Section>

      <Section number="03" eyebrow="Chapéus" title="Pequenos sinais de contexto">
        <div className={styles.eyebrowShowcase}>{["Próximo passo", "Secretaria", "Próximo encontro", "Desenvolvimento", "Minha jornada"].map((item) => <div key={item}><span>{item}</span><i aria-hidden="true" /></div>)}</div>
      </Section>

      <Section number="04" eyebrow="Ações" title="Botões e links" intro="Uma ação domina o contexto; as demais reduzem presença sem perder clareza.">
        <div id="botoes" className={styles.componentTable}>
          <div className={styles.tableHeader}><span>Componente</span><span>Normal</span><span>Hover</span><span>Focus</span><span>Disabled</span></div>
          <div className={styles.tableRow}><strong>Primary orange</strong><button className={styles.primary}>Continuar</button><button className={`${styles.primary} ${styles.forceHover}`}>Continuar</button><button className={`${styles.primary} ${styles.forceFocus}`}>Continuar</button><button className={styles.primary} disabled>Continuar</button></div>
          <div className={styles.tableRow}><strong>Primary navy</strong><button className={styles.primaryNavy}>Salvar</button><button className={`${styles.primaryNavy} ${styles.forceHover}`}>Salvar</button><button className={`${styles.primaryNavy} ${styles.forceFocus}`}>Salvar</button><button className={styles.primaryNavy} disabled>Salvar</button></div>
          <div className={styles.tableRow}><strong>Secondary</strong><button className={styles.secondary}>Ver encontro</button><button className={`${styles.secondary} ${styles.forceHover}`}>Ver encontro</button><button className={`${styles.secondary} ${styles.forceFocus}`}>Ver encontro</button><button className={styles.secondary} disabled>Ver encontro</button></div>
          <div className={`${styles.tableRow} ${styles.darkRow}`}><strong>Ghost light</strong><button className={styles.ghostLight}>Conhecer</button><button className={`${styles.ghostLight} ${styles.forceHover}`}>Conhecer</button><button className={`${styles.ghostLight} ${styles.forceFocus}`}>Conhecer</button><button className={styles.ghostLight} disabled>Conhecer</button></div>
          <div className={styles.tableRow}><strong>Text link</strong><a className={styles.textLink} href="#cards">Ver detalhes</a><a className={`${styles.textLink} ${styles.forceHover}`} href="#cards">Ver detalhes</a><a className={`${styles.textLink} ${styles.forceFocus}`} href="#cards">Ver detalhes</a><span className={`${styles.textLink} ${styles.disabledLink}`} aria-disabled="true">Ver detalhes</span></div>
        </div>
      </Section>

      <Section number="05" eyebrow="Família de cards" title="Composição antes de decoração">
        <div id="cards" className={styles.cardGrid}>
          <article className={`${styles.card} ${styles.actionCard}`}><div className={styles.cardEyebrow}><span>Próximo passo</span><strong>Secretaria</strong></div><h3>Preparar a comunicação do próximo encontro.</h3><p>A escala já foi finalizada pelo Líder.</p><button className={styles.primary}>Continuar</button></article>
          <article className={`${styles.card} ${styles.infoCard}`}><div className={styles.cardEyebrow}><span>Próximo encontro</span></div><p className={styles.cardMeta}>Terça-feira · 08/09 · 19h40</p><h3>Lição 13</h3><p>Uma vida guiada pelo Espírito</p><dl><div><dt>Sua participação</dt><dd>Boas-vindas e Avisos</dd></div></dl><button className={styles.secondary}>Ver encontro</button></article>
          <article className={`${styles.card} ${styles.personCard}`}><p className={styles.cardEyebrow}>Pessoa</p><h3>Maria</h3><p className={styles.personBond}>Membro</p><p className={styles.personRoles}>Secretária <span aria-hidden="true">·</span> Líder em Treinamento</p><a className={styles.textLink} href="#cards">Ver perfil</a></article>
        </div>
      </Section>

      <Section number="06" eyebrow="Status e estados" title="Sinais discretos, significado claro">
        <div className={styles.statusGrid}>
          <div className={`${styles.status} ${styles.info}`}><span aria-hidden="true">i</span><div><strong>Informação</strong><p>O encontro começa às 19h40.</p></div></div>
          <div className={`${styles.status} ${styles.attention}`}><span aria-hidden="true">!</span><div><strong>Atenção</strong><p>Revise as informações antes de continuar.</p></div></div>
          <div className={`${styles.status} ${styles.complete}`}><span aria-hidden="true">✓</span><div><strong>Concluído</strong><p>Comunicação preparada.</p></div></div>
          <div className={`${styles.status} ${styles.unavailable}`}><span aria-hidden="true">—</span><div><strong>Indisponível</strong><p>Esta ação não está disponível agora.</p></div></div>
        </div>
      </Section>

      <Section number="07" eyebrow="Formulários" title="Clareza antes e depois da interação">
        <form className={styles.formDemo}>
          <div className={styles.field}><label htmlFor="ds-name">Nome completo</label><input id="ds-name" type="text" placeholder="Como você prefere ser chamado?" /><small>Use o nome pelo qual a igreja conhece você.</small></div>
          <div className={styles.field}><label htmlFor="ds-cell">Célula</label><select id="ds-cell" defaultValue="genesis"><option value="genesis">Gênesis</option><option value="">Selecione uma célula</option></select></div>
          <div className={styles.field}><label htmlFor="ds-note">Observação</label><textarea id="ds-note" rows={4} placeholder="Escreva uma observação breve" /></div>
          <div className={`${styles.field} ${styles.errorField}`}><label htmlFor="ds-email">E-mail</label><input id="ds-email" type="email" defaultValue="maria@" aria-invalid="true" aria-describedby="email-error" /><small id="email-error" role="alert">Informe um e-mail válido.</small></div>
          <div className={styles.field}><label htmlFor="ds-disabled">Campo indisponível</label><input id="ds-disabled" type="text" value="Definido pela liderança" disabled readOnly /><small>Este valor não pode ser alterado neste contexto.</small></div>
          <fieldset className={styles.choiceGroup}><legend>Disponibilidade</legend><label><input type="checkbox" defaultChecked /><span>Estou disponível para este encontro</span></label><label><input type="checkbox" disabled /><span>Opção indisponível</span></label></fieldset>
          <fieldset className={styles.choiceGroup}><legend>Preferência de contato</legend><label><input type="radio" name="contact" defaultChecked /><span>WhatsApp</span></label><label><input type="radio" name="contact" /><span>Ligação</span></label></fieldset>
          <div className={styles.switchField}><span><strong>Lembrete do encontro</strong><small>Receber um lembrete antes do próximo encontro.</small></span><label className={styles.switch}><input type="checkbox" defaultChecked /><span aria-hidden="true" /></label></div>
        </form>
      </Section>

      <Section number="08" eyebrow="Navegação mobile" title="Presença discreta, acesso próximo">
        <div className={styles.phoneFrame}><div className={styles.phoneContent}><span>Conteúdo da página</span></div><nav className={styles.mobileNavDemo} aria-label="Demonstração da navegação móvel"><a className={styles.active} href="#mobile"><Icon name="home" /><span>Início</span></a><a href="#mobile"><Icon name="cell" /><span>Célula</span></a><a href="#mobile"><Icon name="journey" /><span>Jornada</span></a><a href="#mobile"><Icon name="more" /><span>Mais</span></a></nav></div>
      </Section>

      <Section number="09" eyebrow="Navegação desktop" title="Estrutura leve e institucional">
        <div className={styles.desktopFrame}><aside className={styles.sidebarDemo}><header><strong>Nova Igreja Batista</strong><small>Portal</small></header><nav aria-label="Demonstração da navegação desktop"><p>Principal</p><a className={styles.active} href="#desktop"><Icon name="home" />Início</a><a href="#desktop"><Icon name="cell" />Minha Célula</a><p>Minha Jornada</p><a href="#desktop"><Icon name="journey" />Jornada DNA</a><a href="#desktop"><Icon name="people" />Grupo de Discipulado</a><p>Conta</p><a href="#desktop"><Icon name="profile" />Meu Perfil</a></nav><footer><strong>Maria</strong><small>Membro</small></footer></aside><div className={styles.desktopContent}><span>Área de conteúdo</span><h3>Uma estrutura que organiza sem dominar.</h3><p>A navegação apoia a experiência e mantém a identidade institucional em primeiro plano.</p></div></div>
      </Section>

      <Section number="10" eyebrow="Interactive Row" title="Navegação contextual com clareza no toque" intro="Uma linha compacta para listas navegáveis, com hierarquia textual e affordance visível sem assumir aparência de botão grande.">
        <div className={styles.interactiveRowDemo}>
          <a href="#interactive-row"><span><strong>Jornada DNA</strong><small>Cresça 2 · Aula 4 de 7</small></span><Icon name="chevron" /></a>
          <a href="#interactive-row"><span><strong>Grupo de Discipulado</strong><small>15/09 · 20h</small></span><Icon name="chevron" /></a>
        </div>
      </Section>

      <footer className={styles.labFooter}><p>Laboratório interno · Não faz parte da navegação principal</p><strong>Nova Igreja Batista</strong></footer>
    </main>
  );
}
