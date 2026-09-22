"use client";
import Link from "next/link";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return <main style={{ maxWidth: 780, margin: "auto", padding: 24 }}><h1>Não foi possível carregar os encontros</h1>
    <p>Confira sua conexão e tente novamente. Suas alterações já salvas permanecem no banco.</p>
    <button onClick={reset}>Tentar novamente</button><p><Link href="/acesso">Voltar ao acesso</Link></p>
  </main>;
}
