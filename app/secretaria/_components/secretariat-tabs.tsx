"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "../secretaria.module.css";

const tabs = [
  { label: "Visão Geral", href: "/secretaria" },
  { label: "Encontros", href: "/secretaria/encontros" },
  { label: "Lanche", href: "/secretaria/lanche" },
  { label: "Pessoas", href: "/secretaria/pessoas" },
  { label: "Histórico", href: "/secretaria/historico" },
] as const;

export function SecretariatTabs() {
  const pathname = usePathname();

  return (
    <nav className={styles.tabs} aria-label="Seções da Secretaria da Célula">
      {tabs.map((tab) => (
        <Link key={tab.href} href={tab.href} aria-current={pathname === tab.href ? "page" : undefined}>
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
