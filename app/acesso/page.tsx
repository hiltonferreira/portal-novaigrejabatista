import { SubmitButton } from "@/app/encontros-compartilhados/submit-button";
import Link from "next/link";
import { sharedAccessConfigured } from "@/lib/supabase/config";
import { signIn } from "./actions";
import styles from "../encontros-compartilhados/shared.module.css";
export default async function Access({ searchParams }: { searchParams: Promise<{ estado?: string }> }) {
  const { estado } = await searchParams;
  return <main className={styles.page}><p>Nova Igreja Batista · ambiente de teste</p><h1>Acessar meus encontros</h1>
    {sharedAccessConfigured() ? <><p>Entre com sua conta de teste. Suas responsabilidades determinam as ações disponíveis.</p>
      {estado === "erro" && <p role="alert">Não foi possível entrar. Confira seus dados e tente novamente.</p>}
      <form action={signIn} className={styles.form}>
        <label>E-mail<input name="email" type="email" autoComplete="username" required maxLength={254} /></label>
        <label>Senha<input name="password" type="password" autoComplete="current-password" required maxLength={256} /></label>
        <SubmitButton>Entrar</SubmitButton>
      </form></> : <p>O acesso compartilhado está aguardando configuração. A demonstração continua disponível.</p>}
    <Link href="/">Voltar à demonstração</Link></main>;
}
