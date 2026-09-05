"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "../pastor.module.css";

const tabs = [
  { label: "Visão Geral", href: "/pastor" },
  { label: "Estudos", href: "/pastor/estudos" },
  { label: "Células", href: "/pastor/celulas" },
] as const;

export function PastorNavigation() {
  const pathname = usePathname();
  return <nav className={styles.tabs} aria-label="Seções da Liderança Pastoral">
    {tabs.map((tab) => {
      const active = tab.href === "/pastor" ? pathname === tab.href : pathname.startsWith(tab.href);
      return <Link key={tab.href} href={tab.href} aria-current={active ? "page" : undefined}>{tab.label}</Link>;
    })}
  </nav>;
}

export function PastorHeaderContext() {
  const pathname = usePathname();
  const studies = pathname.startsWith("/pastor/estudos");
  return <div className={styles.headerContext}>
    <span>{studies ? "Estudos oficiais" : "Acompanhamento pastoral"}</span>
    <p>{studies
      ? "Organize as lições oficiais e programe a semana em que serão estudadas pelas células."
      : "Acompanhe responsabilidades, conteúdos oficiais e contextos de liderança da igreja."}</p>
  </div>;
}
