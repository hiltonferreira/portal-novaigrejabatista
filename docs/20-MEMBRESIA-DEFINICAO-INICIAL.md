# Membros/Membresia — definição inicial

Data: 01/11/2026. Estado: proposta em análise, não aprovada para implementação.

## Diagnóstico e bases

Main: 5c0b02a1e2ba7ea113960e0eae6202f05d7f94b8. Base documental desta branch: feat/secretaria-encontro-simplificado, d1e3dacec1d299c1ce76b10f2bd32b69cfdbfccc. PRs #2–#4 são rascunhos não integrados; PR #1 contém linha paralela que não foi reconciliada. Não escolher automaticamente esta base como base final de implementação.

Foram lidos AGENTS.md, Fonte de Verdade, Pessoas e Vínculos, Permissões e Autoridade, Modelo de Domínio, Decisões Pendentes e Andamento. Inspecionados lib/supabase/config.ts, diretório demonstrativo de pessoas e migration 001. Autenticação compartilhada é condicionada à configuração e bloqueada em VERCEL_ENV=production. O histórico registra migration 002 aplicada no banco de teste, mas login/testes entre perfis ainda pendentes. Isso não comprova estado remoto atual.

Preview: consulta ao projeto Vercel retornou 403 por falta de autorização da equipe; deployment, SHA publicado e telas atuais ainda não verificados. Não afirmar que endereço estável corresponde à branch mais recente. Conferência visual e comparação do SHA publicado são pendências anteriores à implementação.

## Regras já estabelecidas

Pessoa é única e distinta de Conta. Visitante, Frequentador e Membro são vínculos mutuamente exclusivos. Responsabilidades podem coexistir em contextos diferentes. Mudanças de vínculo dependem de confirmação humana. Critérios formais de membresia continuam pendentes: não presumir batismo ou conclusão da Jornada DNA. Secretaria de célula e Secretaria Pastoral são funções diferentes.

## Proposta inicial — sujeita à validação de Hilton
Objetivo: manter um cadastro único de pessoas e acompanhar vínculo com a igreja, participação em célula e responsabilidades, com histórico e acesso contextual. Cadastro não cria login nem torna alguém Membro.

Escopo inicial proposto: localizar/cadastrar Pessoa; conferir possíveis duplicidades; consultar ficha; solicitar/corrigir dados; registrar mudança humana de vínculo e histórico. Importação de inscritos, integração financeira, progressão automática e cuidado pastoral confidencial ficam fora deste recorte.

Acessos propostos (não concedidos):
- Pessoa com conta: consultar os próprios dados e solicitar correção.
- Secretaria da célula: dados operacionais mínimos das pessoas da própria célula; encaminhar correções; sem decisão de membresia.
- Líder: acompanhamento das pessoas da própria célula; encaminhar decisões; sem promoção automática.
- Supervisor/Coordenador: visão pertinente ao contexto atribuído, sem herdar ficha completa.
- Secretaria Pastoral: cadastro e registros administrativos expressamente delegados; decisão e registro separados.
- Liderança Pastoral: decisões eclesiais de sua competência; autoridade específica para membresia ainda precisa de confirmação.
- Admin técnico: configuração e suporte, sem acesso funcional irrestrito presumido.

Dados propostos: identificador interno; nome; contato preferencial quando disponível; vínculo atual; participação em célula e suas datas; responsabilidades por contexto; autoria/data/histórico de mudanças. Nascimento/aniversário, endereço, família/responsável de menor, batismo e Jornada DNA precisam de finalidade e obrigatoriedade validadas. Não solicitar CPF, documentos ou anexos nesta primeira versão. Pessoa sem conta e sem célula deve ser representável. Telefone compartilhado não prova duplicidade.

Fluxos: busca → verificar possível duplicidade → cadastro mínimo → revisar; ficha → solicitar correção → revisão autorizada → histórico; proposta de mudança de vínculo → decisão humana autorizada → registro com autor/data; atribuição de conta separada do cadastro. Encerramento de participação, transferência e inativação são dimensões pendentes e não novos vínculos inventados.

Telas a validar depois do escopo: entrada por responsabilidade/próximo passo; lista/busca de pessoas; cadastro mínimo; ficha; pendências/correções; confirmação de vínculo e histórico. Usar apenas dados fictícios, com estados vazio, carregando, erro e acesso negado, em celular e desktop.

Pendências de produto: quem decide membresia e quem registra; critérios formais; o que cada função vê/edita; campos obrigatórios; política para menores e contatos compartilhados; transferência/inativação; necessidade de autosserviço já no MVP.

Reaproveitamento técnico: shell/tokens/componentes e diretórios demonstrativos; Supabase Auth, Pessoa/Conta/atribuições e isolamento existentes como base candidata. Schema atual portal_people tem apenas id/nome; responsibility='member' em portal_assignments é autorização contextual e não comprova vínculo eclesial Membro. Auditoria atual exige encounter_id: não serve diretamente ao histórico geral de membresia. Não ampliar SELECT de pessoas nem reutilizar política de presença como permissão de ficha. Validar tudo antes de migrations.

## Coordenação e responsabilidades

Issue de coordenação e revisão Claude: https://github.com/hiltonferreira/novaigrejabatista/issues/11 . Workflow existente permanece no repositório do site; não foi copiado para o Portal. Codex conduz diagnóstico e proposta; Claude revisa independentemente por comentário; Hilton valida regras de negócio e telas. Solicitação enviada ao Claude; resposta deve ser lida e confrontada com evidências antes de declarar revisão concluída.

## Proteção e sequência

Nenhuma alteração funcional, migration, credencial, produção ou dado real nesta etapa. Não mesclar esta branch automaticamente. Não importar participantes de eventos. Na próxima etapa: concluir verificação do Preview e revisão; validar escopo/acessos/dados/fluxos com Hilton; desenhar telas com dados fictícios conforme docs/15-DESIGN-SYSTEM.md; validar telas; somente então planejar implementação isolada em teste.
