import { notFound } from "next/navigation";
import { ActionLink, PageIntro, PortalShell } from "@/components/portal-shell";

const pages = {
  lideranca: { title: "Liderança", eyebrow: "Minha responsabilidade", description: "Acompanhe sua preparação como Líder em Treinamento.", body: <article className="detail-card accent"><span className="label">Próxima preparação</span><h2>Você ministrará a Palavra no encontro de 15/09.</h2><p>A participação na função Palavra faz parte desta escala e não altera automaticamente responsabilidades de liderança.</p><ActionLink href="/minha-celula" variant="text">Ver contexto da célula</ActionLink></article> },
  "jornada-dna": { title: "Jornada DNA", eyebrow: "Minha jornada", description: "Seu percurso de crescimento, do Descubra à Formação DNA.", body: <><article className="detail-card accent"><span className="status">Em andamento</span><h2>Cresça 2</h2><p>Aula 4 de 7</p><div className="progress" aria-label="4 de 7 aulas concluídas"><span style={{ width: "57%" }} /></div><ActionLink href="/jornada-dna">Continuar aula</ActionLink></article><ol className="module-list"><li className="done"><span>1</span><div><strong>Descubra</strong><small>Concluído</small></div></li><li className="done"><span>2</span><div><strong>Cresça 1</strong><small>Concluído</small></div></li><li className="current"><span>3</span><div><strong>Cresça 2</strong><small>Em andamento</small></div></li><li><span>4</span><div><strong>Formação DNA</strong><small>Próximo módulo</small></div></li></ol></> },
  "grupo-de-discipulado": { title: "Grupo de Discipulado", eyebrow: "Minha jornada", description: "Encontros e próximos passos do seu grupo.", body: <article className="detail-card accent"><span className="label">Próximo encontro</span><h2>15/09 · 20h</h2><p>As demais informações ainda serão definidas pelo responsável.</p><div className="notice">Nenhuma preparação pendente neste momento.</div></article> },
  "meu-perfil": { title: "Meu Perfil", eyebrow: "Maria", description: "Seus vínculos e responsabilidades atuais.", body: <><article className="profile-card"><div><h2>Maria</h2><p>Nova Igreja Batista</p></div></article><article className="detail-card"><span className="label">Vínculo</span><div className="tag-list"><span>Membro</span></div><span className="label spaced">Responsabilidades</span><div className="tag-list"><span>Secretária</span><span>Líder em Treinamento</span></div></article></> },
  mais: { title: "Mais", eyebrow: "Navegação", description: "Acesse suas responsabilidades, jornada e perfil.", body: <div className="link-stack"><ActionLink href="/secretaria">Secretaria</ActionLink><ActionLink href="/lideranca">Liderança</ActionLink><ActionLink href="/grupo-de-discipulado">Grupo de Discipulado</ActionLink><ActionLink href="/meu-perfil">Meu Perfil</ActionLink></div> },
} as const;

export function generateStaticParams() { return Object.keys(pages).map((slug) => ({ slug: [slug] })); }

export default async function DetailPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const key = slug.join("/") as keyof typeof pages;
  const page = pages[key];
  if (!page) notFound();
  return <PortalShell currentPath={`/${key}`}><PageIntro eyebrow={page.eyebrow} title={page.title} description={page.description} /><div className="detail-layout">{page.body}</div></PortalShell>;
}
