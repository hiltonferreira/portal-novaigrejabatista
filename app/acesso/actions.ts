"use server";
import { redirect } from "next/navigation";
import { database } from "@/lib/supabase/server";
import { sharedAccessConfigured } from "@/lib/supabase/config";
export async function signIn(form: FormData) {
  if (!sharedAccessConfigured()) redirect("/acesso?estado=indisponivel");
  const email = String(form.get("email") ?? "").trim();
  const password = String(form.get("password") ?? "");
  if (!email || email.length > 254 || !password || password.length > 256) redirect("/acesso?estado=erro");
  const client = await database();
  const { error } = await client.auth.signInWithPassword({ email, password });
  if (error) redirect("/acesso?estado=erro");
  redirect("/encontros-compartilhados");
}
export async function signOut() {
  if (sharedAccessConfigured()) {
    const client = await database();
    const { error } = await client.auth.signOut();
    if (error) redirect("/encontros-compartilhados?estado=erro");
  }
  redirect("/acesso");
}
