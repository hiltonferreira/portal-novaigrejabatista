"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "../pastor.module.css";

const views = [
  { href: "/pastor/coordenacao", label: "Lista" },
  { href: "/pastor/coordenacao/estrutura", label: "Estrutura" },
] as const;

export function PastoralCoordinationNavigation() {
  const pathname = usePathname();
  return <nav className={styles.cellsViewNavigation} aria-label="Visualização da coordenação">
    {views.map((view) => <Link key={view.href} href={view.href} aria-current={pathname === view.href ? "page" : undefined}>{view.label}</Link>)}
  </nav>;
}
