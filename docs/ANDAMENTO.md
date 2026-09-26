# Andamento do desenvolvimento

## 26/09/2026 — simplificação visual da Secretaria em branch de teste

- Na branch `feat/secretaria-encontro-simplificado`, a lista da Secretaria apresenta um único estado de destaque por encontro; detalhes e demais estados permanecem nas telas do encontro.
- A Visão Geral do encontro apresenta uma ação em destaque, resumo das etapas e referências discretas a lanche/escala, mantendo Comunicação, Presença e Relatório em suas abas.
- Datas de encontros demonstrativos vencidos passam à seção de encontros anteriores; a lista de próximos encontros mostra estado vazio quando pertinente.
- São alterações de apresentação e classificação temporal da demonstração. Não concedem novas permissões nem integram as telas demonstrativas ao banco; a validação multiusuário autenticada segue pendente.
- Verificação local: seis testes, lint, TypeScript e build concluídos. O navegador disponível nesta sessão não acessou o servidor local, portanto ainda falta revisão visual efetiva do novo Preview.

## Etapa: fluxo demonstrativo de encontro

Branch: `feat/fluxo-encontro-integrado`.
Base: `5c0b02a1e2ba7ea113960e0eae6202f05d7f94b8`.

### Implementado

- Estado React compartilhado na raiz, isolado por encontro.
- Estudos/programação/PDF pastoral compartilhados com a comunidade e a Secretaria.
- Presença e visitantes utilizados pelo relatório; rascunho preservado durante navegação.
- Cópia do conteúdo enviado e consulta demonstrativa pelo Líder.
- Status de envio/leitura compartilhado com as telas de Secretaria.
- Encontros criados preservados durante navegação.
- Aviso explícito sobre reinício dos dados ao recarregar.
- Testes de integração de componentes: `npm test`.

### Validação

Validação final: quatro testes de integração passaram; `npm run lint` sem erros ou avisos de lint; `npm run build` concluído com sucesso.

Verificação visual não concluída: agent-browser não iniciou e o download do Chromium excedeu o limite de rede. Os testes usam DOM simulado; não comprovam layout, teclado ou responsividade em navegador real.

### Próximo passo

Revisar a prévia da branch na Vercel e executar o roteiro em `18-FLUXO-DEMONSTRATIVO-ENCONTRO.md`, incluindo celular. Não houve autorização para produção. Não mesclar automaticamente.

Depois: contextualizar datas/resumos, integrar os fluxos restantes de preparação e definir a passagem para persistência, autenticação e autorização real. Regras pendentes da igreja continuam em `DECISOES-PENDENTES.md`.


## 22/09/2026 — primeiro recorte persistente preparado

- Implementados `/acesso` e `/encontros-compartilhados`, com Supabase Auth, cookies renováveis e consultas autenticadas no servidor.
- Migration de Pessoas/Contas/atribuições/células/encontros/relatórios/auditoria com RLS, escritas por RPC, isolamento por célula e controle de versão.
- Secretaria altera local/comunicado; Membro consulta; relatório rascunho → enviado → visualizado, com leitura exclusiva da Secretaria e Líder correspondente.
- Script de preparação de dados fictícios e roteiro multiusuário em `19-ACESSO-COMPARTILHADO.md`.
- Não migra presença, estudos/PDF, lanche, escalas e demais telas; essas áreas continuam demonstrativas.
- Verificação: cinco testes passaram, incluindo migration e permissões em PostgreSQL embarcado; lint e build verificados. Testes remotos com Supabase Auth e navegadores separados pendentes.
- Bloqueio: conexão Vercel respondeu 403 por falta de acesso à equipe; nenhum projeto Supabase/credencial de teste disponível. Não aplicado schema remoto nem configuradas variáveis.
- Nenhuma alteração de produção ou merge. Ativar somente Preview após recuperar acesso e configurar banco de teste.

## 22/09/2026 — presença compartilhada preparada em branch isolada

- `feat/presenca-compartilhada`, baseada na branch de Preview `feat/fluxo-encontro-integrado`: presença por pessoa e encontro em PostgreSQL, incluindo estado explícito sem registro.
- Secretaria vê e altera somente o rol da própria célula; a edição encerra no envio do relatório. O Líder recebe apenas totais congelados do envio, sem lista de nomes; Membro não consulta presença.
- Migration aditiva `202609220002_attendance.sql`, com RPCs de leitura/escrita autorizadas, controle de versão, bloqueio concorrente e auditoria.
- Validação local: seis testes passaram, incluindo permissões e snapshots no PostgreSQL embarcado; lint, TypeScript e build concluídos. A migration 002 e o teste multiusuário desta etapa ainda precisam ser executados no banco/Preview de teste.
- Nenhuma publicação na branch `main` ou no endereço de produção.

## 23/09/2026 — ativação do banco de teste

- Aplicada a migration 002 no projeto Supabase `portal-novaigrejabatista-preview` da organização de testes. Consulta no SQL Editor confirmou tabela/coluna novas, acesso à RPC pelo papel `authenticated` e ausência de `SELECT` direto em `portal_attendance`.
- Configuradas as três variáveis de conexão da Vercel apenas para `feat/presenca-compartilhada` em Preview. As configurações da branch original e da produção não foram alteradas.
- O redeploy da branch ficou **Ready** no painel da Vercel; o Preview `portal-novaigrejabatista-li72pj9h0.vercel.app` passou a exibir `/acesso` com e-mail e senha. A prévia anterior estava sem configuração.
- Pendente: login e roteiro multiusuário no navegador. Não afirmar que o teste remoto passou até observar as contas Secretaria, Membro e Líder na nova prévia.
