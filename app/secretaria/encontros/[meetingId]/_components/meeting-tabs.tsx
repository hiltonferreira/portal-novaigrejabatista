"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "../../../secretaria.module.css";

export function MeetingTabs({ meetingId }: { meetingId: string }) {
  const pathname = usePathname();
  const basePath = `/secretaria/encontros/${meetingId}`;
  const tabs = [
    { label: "Visão Geral", href: basePath },
    { label: "Comunicação", href: `${basePath}/comunicacao` },
    { label: "Presença", href: `${basePath}/presenca` },
    { label: "Relatório", href: `${basePath}/relatorio` },
  ];

  return (
    <nav className={`${styles.tabs} ${styles.meetingTabs}`} aria-label="Seções deste encontro">
      {tabs.map((tab) => (
        <Link key={tab.href} href={tab.href} aria-current={pathname === tab.href ? "page" : undefined}>
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
