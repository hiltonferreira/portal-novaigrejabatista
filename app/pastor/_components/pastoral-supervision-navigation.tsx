"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "../pastor.module.css";

const views = [
  { href: "/pastor/supervisao", label: "Lista" },
  { href: "/pastor/supervisao/estrutura", label: "Estrutura" },
] as const;

export function PastoralSupervisionNavigation() {
  const pathname = usePathname();

  return (
    <nav className={styles.cellsViewNavigation} aria-label="Visualização da supervisão">
      {views.map((view) => (
        <Link key={view.href} href={view.href} aria-current={pathname === view.href ? "page" : undefined}>
          {view.label}
        </Link>
      ))}
    </nav>
  );
}
