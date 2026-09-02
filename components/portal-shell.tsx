import Link from "next/link";
import { navigation } from "@/data/portal";

type IconName = (typeof navigation)[number]["icon"] | "more";

function NavIcon({ name }: { name: IconName }) {
  const paths: Record<IconName, React.ReactNode> = {
    home: <><path d="M3.5 10.5 12 3l8.5 7.5"/><path d="M5.5 9v11h13V9M9 20v-6h6v6"/></>,
    cell: <><path d="M4 10.5 12 4l8 6.5v8a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5z"/><path d="M8.5 14.5c1.8-1.7 5.2-1.7 7 0"/></>,
    check: <><path d="M5 4h14v16H5z"/><path d="m8 12 2.5 2.5L16 9"/></>,
    leadership: <><path d="M12 3v18M7 8l5-5 5 5"/><path d="M5 15h14"/></>,
    journey: <><circle cx="12" cy="12" r="8"/><path d="M12 7v5l3 2"/></>,
    group: <><circle cx="9" cy="9" r="3"/><circle cx="17" cy="10" r="2.5"/><path d="M3.5 20c.4-4 2.2-6 5.5-6s5.1 2 5.5 6M14 15c3-.4 5 .9 6 4"/></>,
    profile: <><circle cx="12" cy="8" r="3.5"/><path d="M5 21c.5-5 2.8-7.5 7-7.5S18.5 16 19 21"/></>,
    more: <><circle cx="5" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1" fill="currentColor" stroke="none"/></>,
  };
  return <svg className="nav-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

export function PortalShell({ children, currentPath = "/", className = "" }: { children: React.ReactNode; currentPath?: string; className?: string }) {
  return (
    <div className={`portal-shell ${className}`.trim()}>
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <aside className="sidebar" aria-label="Navegação principal">
        <Link className="brand" href="/" aria-label="Nova Igreja Batista — início">
          <span><strong>Nova Igreja Batista</strong><small>Portal</small></span>
        </Link>
        <nav>
          <ul className="nav-list">
            {navigation.map((item, index) => {
              const previousGroup = index > 0 ? navigation[index - 1].group : undefined;
              return (
                <li key={item.href}>
                  {item.group && item.group !== previousGroup ? <p className="nav-group">{item.group}</p> : null}
                  <Link href={item.href} aria-current={currentPath === item.href ? "page" : undefined}>
                    <NavIcon name={item.icon} />{item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="person-chip"><div><strong>Maria</strong><small>Membro</small></div><NavIcon name="profile" /></div>
      </aside>
      <div className="page-area">
        <header className="mobile-header">
          <Link className="brand" href="/"><strong>Nova Igreja Batista</strong></Link>
        </header>
        <main id="conteudo" tabIndex={-1}>{children}</main>
      </div>
      <nav className="bottom-nav" aria-label="Navegação móvel">
        <Link href="/" aria-current={currentPath === "/" ? "page" : undefined}><NavIcon name="home" />Início</Link>
        <Link href="/minha-celula" aria-current={currentPath === "/minha-celula" ? "page" : undefined}><NavIcon name="cell" />Célula</Link>
        <Link href="/jornada-dna" aria-current={currentPath === "/jornada-dna" ? "page" : undefined}><NavIcon name="journey" />Jornada</Link>
        <Link href="/mais" aria-current={currentPath === "/mais" ? "page" : undefined}><NavIcon name="more" />Mais</Link>
      </nav>
    </div>
  );
}

export function PageIntro({ eyebrow, title, description }: { eyebrow?: string; title: string; description: string }) {
  return <header className="page-intro">{eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}<h1>{title}</h1><p>{description}</p></header>;
}

export function ActionLink({ href, children, subtle = false, variant }: { href: string; children: React.ReactNode; subtle?: boolean; variant?: "primary" | "secondary" | "text" }) {
  const resolvedVariant = variant ?? (subtle ? "text" : "primary");
  const className = resolvedVariant === "text" ? "action-link subtle text" : `action-link ${resolvedVariant}`;
  return <Link className={className} href={href}>{children}</Link>;
}
