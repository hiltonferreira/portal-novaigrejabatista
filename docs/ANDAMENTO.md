# Andamento do desenvolvimento

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
