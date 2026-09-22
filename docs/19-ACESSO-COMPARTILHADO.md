# Primeiro recorte com acesso compartilhado

## Autorização e alcance

Em 22/09/2026, após a proposta de login, persistência e permissões, o proprietário solicitou executar o próximo passo. A autorização é para teste/Preview, sem produção. Supabase foi escolhido como implementação inicial de PostgreSQL e autenticação em um único serviço; nenhuma assinatura ou recurso pago foi contratado.

A demonstração anterior continua baseada em mocks. Não foi migrada nem deve receber dados pessoais reais. O novo recorte está em `/acesso` e `/encontros-compartilhados` e não usa a identidade fictícia Maria. Usa conta autenticada, Pessoa independente e múltiplas atribuições por célula. Não há seletor de perfil.

Incluído: login/sair, renovação de sessão, consulta por célula, local/comunicado compartilhados, narrativa reservada em rascunho, envio imutável ao Líder, registro explícito de leitura, auditoria sem conteúdo privado e versão para impedir sobrescrita concorrente. Outra sessão consulta alterações ao atualizar a página; não há atualização automática em tempo real.

Segunda etapa nesta branch: presença individual dos participantes vinculados à célula, por encontro, com três estados na interface (presente, ausente e sem registro). A Secretaria consulta a lista e altera cada marcação até enviar o relatório. No envio, o Líder recebe somente os totais congelados e a narrativa. Pessoas com mais de uma responsabilidade são contadas uma vez. Não há cadastro de visitantes ou criação automática de Pessoas.

Ainda não migrados: visitantes, escalas, lanche, estudos/PDFs, agenda pastoral e demais telas. O relatório deste recorte não substitui o relatório demonstrativo completo. O site público não recebe esses dados.

## Permissões aplicadas no PostgreSQL

| Responsabilidade no contexto da célula | Informações do encontro | Relatório |
| --- | --- | --- |
| Membro | Consulta | Sem acesso |
| Secretaria | Consulta e edição de local/comunicado; registra presença da própria célula até o envio | Escreve rascunho e envia; consulta após envio |
| Líder | Consulta; vê apenas os totais de presença incluídos no relatório enviado | Consulta após envio e registra leitura |
| Sem atribuição ou outra célula | Sem acesso | Sem acesso |

Responsabilidade pastoral isolada não recebe acesso a narrativas: esse alcance ainda precisa de definição. Nenhuma conta altera suas próprias atribuições. Cadastro de Pessoas, vínculo de contas, designações e encontros são provisionados administrativamente somente para este teste. Nenhuma designação eclesial automática.

RLS protege leituras; tabelas não concedem escrita a usuários. A lista de presença nem sequer concede leitura direta: uma RPC a entrega somente à Secretaria da célula. RPCs verificam `auth.uid()` e atribuições no banco, bloqueiam a linha do encontro, validam versão/estado e auditam. Não confiar em papel enviado pela interface nem em `user_metadata`. A aplicação usa apenas chave publicável e sessão do usuário; nunca `service_role`.

## Ativação no ambiente de teste

O Preview com o primeiro recorte foi acessado em sessão anterior, com banco de teste e contas fictícias. O conector de API da Vercel retornou 403, embora a sessão autenticada no navegador tenha acessado a prévia. A segunda migration ainda não foi aplicada remotamente nesta branch; os testes de banco aqui descritos são locais.

1. Usar um projeto Supabase exclusivo para teste. Desabilitar cadastro público e criar contas fictícias confirmadas pelo painel Auth, com senhas únicas; não compartilhar senhas neste documento ou no Git.
2. Em um projeto novo, aplicar `supabase/migrations/202609220001_shared_encounters.sql` e depois `supabase/migrations/202609220002_attendance.sql`. No projeto de teste já existente, aplicar **apenas 002**. Nunca aplicar no banco de produção.
3. Criar pessoas, contas, células, atribuições e encontros fictícios. O arquivo `supabase/seed-test.sql` fornece um roteiro para psql com UUIDs das contas recém-criadas. Não atribuir papéis a contas identificadas só por metadados do usuário.
4. Configurar **somente em Preview**, preferencialmente restrito à branch: `PORTAL_SHARED_ACCESS=true`, `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Fazer novo deploy de Preview.
5. Abrir `/acesso`. Sem configuração, o login permanece indisponível. `VERCEL_ENV=production` também bloqueia este recorte.

Nenhuma migration é aplicada automaticamente durante build/deploy. As contas não são criadas pelo app. O acesso ao SQL Editor do banco de teste é necessário para ativar a segunda etapa. Aplicar 002 antes de abrir um Preview desta branch; a aplicação exige as colunas e funções novas. Testes multiusuário remotos desta etapa seguem pendentes.

## Roteiro de aceite remoto

Usar perfis separados de navegador para Secretaria, Membro, Líder e Líder de outra célula. Todas as contas devem abrir o mesmo deployment/banco de teste.

1. Secretaria modifica local/comunicado; Membro atualiza e vê a mudança. Recarregar e sair/entrar preservam o conteúdo.
2. Secretaria salva rascunho; Líder e Membro não recebem a narrativa, inclusive em acesso direto à API do banco.
3. Secretaria envia; Líder da mesma célula consulta e registra leitura. Secretaria atualiza e vê “Visualizado pelo Líder”. Membro não recebe o relatório.
4. Conta de outra célula não consulta nem altera o encontro/relatório, mesmo conhecendo seu UUID.
5. Duas sessões da Secretaria abrem o mesmo registro. A segunda tentativa sobre versão antiga é rejeitada; nenhuma sobrescrita silenciosa.
6. Depois de enviado, edição do relatório é rejeitada também por RPC direta.
7. Sair encerra acesso; chamadas sem autenticação são rejeitadas. Verificar também sessão expirada, falha de rede, celular, teclado e estados de espera.
8. Secretaria registra um presente e um ausente e deixa outra pessoa sem registro. Membro e Líder não recebem a lista de nomes. Após o envio, o Líder vê os três totais, inclusive “sem registro”. A Secretaria não altera presença depois do envio. Versão antiga e pessoa de outra célula são rejeitadas pelo banco.

## Verificação local

`npm test` inclui a migration executada em PostgreSQL embarcado (PGlite), com papéis SQL e `auth.uid()` controlado para verificar RLS, transições, conflitos, acesso cruzado e auditoria. Não substitui Supabase Auth, cookies, API PostgREST ou navegador real. `npm run lint` e `npm run build` verificam aplicação e tipos.

Referências oficiais consultadas: https://supabase.com/docs/guides/auth/server-side/creating-a-client e https://supabase.com/docs/guides/database/postgres/row-level-security.
