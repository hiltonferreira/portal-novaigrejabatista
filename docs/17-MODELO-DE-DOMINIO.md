# Modelo de Domínio Conceitual

`[DECISÃO DE PRODUTO]` Este inventário orienta futura modelagem. Não é schema definitivo de banco e não autoriza migrations nesta etapa.

## Pessoa e acesso

Pessoa; Conta de acesso; Histórico de vínculo; Atribuições organizacionais; Permissões delegadas; Auditoria.

## Célula e participação

Célula; Histórico de participação em célula; Histórico de funções na célula; Histórico de local; Encontro de Célula; Presença no Encontro; Escala de Lanche.

## Serviço

Função de Serviço; Elegibilidade de Serviço; Disponibilidade; Escala.

## Jornada DNA

Jornada DNA; Módulo; Turma; Aula; Inscrição; Presença; Literatura; Avaliação; Ministrante.

## Discipulado, cuidado e conteúdo

Grupo de Discipulado; Participantes; Encontro do Grupo de Discipulado; Acompanhamento/Cuidado; Pessoa em Oração; Série; Estudo Oficial.

## Estrutura e multiplicação

Multiplicação; Migração de participantes; Árvore/Linhagem; Rede derivada; Líder de origem; Supervisão atual; Coordenação atual; Processo de Supervisão; Processo de Coordenação; Histórico de funções de liderança; Secretaria Pastoral.

## Distinções invariantes

- Multiplicação ≠ Rede ≠ Linhagem completa ≠ Supervisão ≠ Desenvolvimento de Liderança.
- Função de Serviço ≠ Função de Liderança.
- Jornada DNA ≠ Formação DNA.
- Grupo de Discipulado ≠ Célula ≠ módulo da Jornada.
- Aptidão ≠ Designação.
- Permissão técnica ≠ autoridade eclesial.
- Secretaria Pastoral ≠ Liderança Pastoral.

## Relações fundamentais

- Uma Pessoa pode ter múltiplas responsabilidades sem duplicação.
- Conta pertence opcionalmente a uma Pessoa.
- Históricos preservam mudanças humanas de vínculo, participação e função.
- Rede é derivada de filhos diretos; Linhagem considera descendência completa.
- Decisões e registros operacionais devem preservar autoria e autoridade.
