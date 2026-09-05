"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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
  const viewportRef = useRef<HTMLElement>(null);
  const activeLinkRef = useRef<HTMLAnchorElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [scrollEdges, setScrollEdges] = useState({ left: false, right: false });

  useEffect(() => {
    const viewport = viewportRef.current;
    const activeLink = activeLinkRef.current;
    if (!viewport) return;

    const updateEdges = () => {
      const maximum = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
      const visibleStart = viewport.scrollLeft;
      const visibleEnd = visibleStart + viewport.clientWidth;
      const links = linkRefs.current.filter((link): link is HTMLAnchorElement => Boolean(link));
      const clippedLeft = links.find((link) => link.offsetLeft < visibleStart && link.offsetLeft + link.offsetWidth > visibleStart);
      const clippedRight = links.find((link) => link.offsetLeft < visibleEnd && link.offsetLeft + link.offsetWidth > visibleEnd);
      const shell = viewport.parentElement;

      shell?.style.setProperty("--tabs-left-cover", `${Math.max(44, clippedLeft ? clippedLeft.offsetLeft + clippedLeft.offsetWidth - visibleStart + 10 : 44)}px`);
      shell?.style.setProperty("--tabs-right-cover", `${Math.max(44, clippedRight ? visibleEnd - clippedRight.offsetLeft + 10 : 44)}px`);
      setScrollEdges({ left: viewport.scrollLeft > 2, right: viewport.scrollLeft < maximum - 2 });
    };

    if (activeLink) {
      const itemStart = activeLink.offsetLeft;
      const itemEnd = itemStart + activeLink.offsetWidth;
      const visibleStart = viewport.scrollLeft;
      const visibleEnd = visibleStart + viewport.clientWidth;

      if (itemStart < visibleStart) viewport.scrollTo({ left: itemStart, behavior: "auto" });
      else if (itemEnd > visibleEnd) viewport.scrollTo({ left: itemEnd - viewport.clientWidth, behavior: "auto" });
    }

    updateEdges();
    viewport.addEventListener("scroll", updateEdges, { passive: true });
    const resizeObserver = new ResizeObserver(updateEdges);
    resizeObserver.observe(viewport);

    return () => {
      viewport.removeEventListener("scroll", updateEdges);
      resizeObserver.disconnect();
    };
  }, [pathname]);

  function reveal(direction: "previous" | "next") {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const links = linkRefs.current.filter((link): link is HTMLAnchorElement => Boolean(link));
    const visibleStart = viewport.scrollLeft;
    const visibleEnd = visibleStart + viewport.clientWidth;

    if (direction === "next") {
      const next = links.find((link) => link.offsetLeft + link.offsetWidth > visibleEnd + 2);
      viewport.scrollTo({ left: next ? next.offsetLeft : viewport.scrollWidth, behavior: "smooth" });
      return;
    }

    const previous = links.filter((link) => link.offsetLeft < visibleStart - 2).at(-1);
    viewport.scrollTo({ left: previous?.offsetLeft ?? 0, behavior: "smooth" });
  }

  return (
    <div className={styles.tabsShell} data-scroll-left={scrollEdges.left || undefined} data-scroll-right={scrollEdges.right || undefined}>
      {scrollEdges.left ? <button className={`${styles.tabsScrollControl} ${styles.tabsScrollPrevious}`} type="button" aria-label="Mostrar opções anteriores" onClick={() => reveal("previous")}>‹</button> : null}
      <nav ref={viewportRef} className={styles.tabs} aria-label="Seções da Secretaria da Célula">
        {tabs.map((tab, index) => {
          const isActive = tab.href === "/secretaria"
            ? pathname === tab.href
            : pathname === tab.href || pathname.startsWith(`${tab.href}/`);

          return (
            <Link
              ref={(element) => { linkRefs.current[index] = element; if (isActive) activeLinkRef.current = element; }}
              key={tab.href}
              href={tab.href}
              aria-current={isActive ? "page" : undefined}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
      {scrollEdges.right ? <button className={`${styles.tabsScrollControl} ${styles.tabsScrollNext}`} type="button" aria-label="Mostrar mais opções" onClick={() => reveal("next")}>›</button> : null}
    </div>
  );
}
