"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "../pastor.module.css";

const views = [
  { href: "/pastor/celulas", label: "Lista" },
  { href: "/pastor/celulas/arvore", label: "Árvore de células" },
] as const;

export function PastoralCellsNavigation() {
  const pathname = usePathname();

  return (
    <nav className={styles.cellsViewNavigation} aria-label="Visualização das células">
      {views.map((view) => (
        <Link key={view.href} href={view.href} aria-current={pathname === view.href ? "page" : undefined}>
          {view.label}
        </Link>
      ))}
    </nav>
  );
}
