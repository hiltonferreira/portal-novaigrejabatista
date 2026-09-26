"use client";

import { useSyncExternalStore } from "react";
import { PageTitle } from "@/components/page-title";
import { PortalShell } from "@/components/portal-shell";
import { secretariatOverviewMock } from "@/data/secretariat";
import { SecretariatTabs } from "./secretariat-tabs";
import styles from "../secretaria.module.css";

const preferenceKey = "portal-secretaria-modo-escuro";
const preferenceEvent = "portal-secretaria-tema-atualizado";
let temporaryPreference = false;

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(preferenceEvent, onChange);
  return () => { window.removeEventListener("storage", onChange); window.removeEventListener(preferenceEvent, onChange); };
}

function getPreference() {
  try { return localStorage.getItem(preferenceKey) === "true"; } catch { return temporaryPreference; }
}

export function SecretariatThemeShell({ children }: { children: React.ReactNode }) {
  const dark = useSyncExternalStore(subscribe, getPreference, () => false);

  function toggleTheme() {
    const next = !dark;
    temporaryPreference = next;
    try { localStorage.setItem(preferenceKey, String(next)); } catch { /* Mantém a preferência somente nesta visita. */ }
    window.dispatchEvent(new Event(preferenceEvent));
  }

  return <PortalShell currentPath="/secretaria" className={`${styles.secretariatTheme} ${dark ? styles.secretariatDark : ""}`}>
    <header className={styles.header}>
      <PageTitle leading="Secretaria da" accent="Célula" />
      <div className={styles.headerContext}>
        <button type="button" className={styles.themeToggle} aria-pressed={dark} onClick={toggleTheme}>{dark ? "Desativar modo escuro" : "Ativar modo escuro"}</button>
        <span className={styles.cellContextTag}>{secretariatOverviewMock.cell.name}</span>
        <p><span>{secretariatOverviewMock.supportingText.firstLine}</span>{" "}<span className={styles.descriptionContinuation}>{secretariatOverviewMock.supportingText.secondLine}</span></p>
      </div>
    </header>
    <SecretariatTabs />
    {children}
  </PortalShell>;
}
