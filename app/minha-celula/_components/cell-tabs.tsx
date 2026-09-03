"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "../minha-celula.module.css";

const tabs = [
  { label: "Visão Geral", href: "/minha-celula" },
  { label: "Pessoas", href: "/minha-celula/pessoas" },
  { label: "Encontros", href: "/minha-celula/encontros" },
  { label: "Escalas", href: "/minha-celula/escalas" },
] as const;

export function CellTabs() {
  const pathname = usePathname();

  return (
    <nav className={styles.tabs} aria-label="Seções de Minha Célula">
      {tabs.map((tab) => (
        <Link key={tab.href} href={tab.href} aria-current={pathname === tab.href ? "page" : undefined}>
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
