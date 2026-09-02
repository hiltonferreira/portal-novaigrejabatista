# Portal Nova Igreja Batista — orientações para agentes

## Leitura obrigatória antes de alterar o sistema

`docs/00-FONTE-DE-VERDADE.md` é a porta de entrada normativa deste projeto. Antes de implementar ou alterar qualquer regra, comportamento, fluxo ou padrão visual:

1. identifique o domínio afetado;
2. leia o documento correspondente em `docs/`;
3. verifique `docs/DECISOES-PENDENTES.md`;
4. não infira regra eclesial ausente;
5. preserve a nomenclatura oficial;
6. respeite autoridade, responsabilidade e contexto de atuação;
7. mantenha mobile-first e acessibilidade;
8. execute lint e build após alterações relevantes.

A implementação atual não é fonte de verdade visual. Não criar novos padrões visuais importantes sem consultar `docs/15-DESIGN-SYSTEM.md`. Não alterar regras de negócio para acomodar código existente. Quando código e documentação divergirem, prevalece a documentação confirmada.

## Propósito do Portal

O Portal Nova Igreja Batista apoia pessoas em seus vínculos, responsabilidades, jornadas e próximos passos na igreja. A interface identifica a instituição como “Nova Igreja Batista”; “NIB” não deve ser usada como marca principal do Portal.

## Princípios de UX

- Organizar a experiência pelo modelo: Pessoa → responsabilidades → contexto atual → tarefas → tarefas executáveis → prioridade → próximo passo.
- Mostrar primeiro o que a pessoa precisa compreender ou fazer agora, sem reduzir a experiência a módulos, cadastros ou um dashboard genérico.
- Ser mobile-first e responsivo; manter a navegação essencial alcançável em telas pequenas.
- Evitar métricas, gráficos, informações e critérios eclesiais inventados.
- Usar conteúdo direto, acolhedor e contextualizado.

## Identidade visual

Os tokens de marca iniciais são `--navy: #060749`, `--ivory: #EBEBDF` e `--orange: #FF7F40`. O design system deve expandi-los por meio de tokens semânticos de texto, superfície, borda, estado, espaçamento, tipografia, raio e movimento. Usar fontes de sistema até que fontes licenciadas sejam fornecidas. Evitar sombras excessivas e aparência corporativa genérica.

## Nomenclaturas obrigatórias

- Usar sempre “Líder em Treinamento”, nunca “LT”.
- Usar sempre “Grupo de Discipulado”, nunca “GD”.
- “Jornada DNA” é o percurso completo.
- Os quatro módulos da Jornada DNA são: Descubra, Cresça 1, Cresça 2 e Formação DNA.
- “Formação DNA” é somente o quarto módulo, não um sinônimo de Jornada DNA.
- Não usar “processo ministerial” nem “ministerial” como sinônimo genérico de liderança ou desenvolvimento.
- “Ministério” é outro conceito e está fora desta primeira versão.

## Decisões arquiteturais

- Adotar Next.js, TypeScript e App Router, com componentes reutilizáveis e CSS baseado em design tokens.
- Manter o código simples, legível e evolutivo. Evitar abstrações, dependências e infraestrutura antes de haver necessidade real.
- Usar mocks nesta etapa. Não implementar banco de dados, autenticação real ou integrações externas.
- A entidade central futura será `Pessoa`. Uma Pessoa pode ter simultaneamente múltiplos vínculos, funções e responsabilidades; Membro, Líder, Supervisor e outros papéis nunca devem gerar pessoas duplicadas.
- Uma Pessoa poderá futuramente possuir uma Conta de acesso, mas `Pessoa` e `Conta` são entidades diferentes.
- Promoções de vínculo e designações de liderança são decisões humanas, nunca automações implícitas.

## Serviço e liderança

Uma função em uma escala de serviço não equivale a função de liderança. “Palavra” não é exclusiva de Líder ou Líder em Treinamento: qualquer pessoa habilitada pelo Líder poderá exercê-la. Essa participação não transforma automaticamente a pessoa em liderança.

## Visão DNA

Desafiar, Nutrir e Apoiar são princípios transversais da Visão DNA. Não representam sequência, workflow, etapas obrigatórias nem três módulos permanentes. A Visão DNA deve permear o sistema sem aprisionar sua arquitetura.

## Acessibilidade

Usar HTML semântico, contraste adequado, foco visível, navegação por teclado, labels persistentes, áreas de toque confortáveis e estados comunicados por mais de um sinal além da cor. Respeitar preferências de movimento reduzido.

## Regras que o agente não pode assumir

Quando uma regra da igreja não estiver definida, o sistema não deve inventá-la. Não criar critérios automáticos de habilitação, progressão, promoção, vínculo, liderança, serviço ou participação. Registrar a lacuna e pedir uma decisão humana antes de transformar uma hipótese em regra de produto ou código.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
