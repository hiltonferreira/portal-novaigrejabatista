# Estudos Oficiais

- `[CONFIRMADO]` Pastor prepara e publica estudos oficiais.
- `[CONFIRMADO]` As células executam o estudo atribuído à semana/período.
- `[CONFIRMADO]` Líderes e Secretaria não criam ou escolhem livremente o estudo oficial.

## Modelo conceitual

Série → Estudos/Lições → período → Encontros das células.

`[CONFIRMADO]` O Pastor cadastra uma única lição oficial e programa a semana em que ela será estudada pelas células. Cada célula mantém seus próprios encontros, em seus respectivos dias e horários, e os encontros da semana resolvem o mesmo estudo oficial programado.

`[CONFIRMADO]` Study não pertence a uma Cell. Secretaria e Líder não escolhem o Study. Encounter não exige associação pastoral individual: sua data resolve a programação oficial da semana correspondente.

`[DECISÃO DE PRODUTO]` A programação semanal e o Encounter são conceitos distintos. A programação referencia `studyId` e o início da semana; a semana começa na segunda-feira e termina no domingo. Não existem, nesta versão, substituição automática, múltiplos estudos oficiais na mesma semana nem exceções por Cell ou Encounter.

`[DECISÃO DE PRODUTO]` No contexto pastoral, os metadados de um Study existente podem ser corrigidos sem criar outro registro. Série, número da lição, título e texto-base são atualizados preservando `Study.id`; essa manutenção não altera automaticamente seu `StudySchedule`.

`[DECISÃO DE PRODUTO]` O PDF oficial é mantido separadamente dos metadados: o Pastor pode adicionar um arquivo ausente ou substituir o arquivo utilizável do Study. Essas ações preservam `Study.id`, seus metadados e a programação semanal. Nesta fase mock, o arquivo permanece somente durante a sessão, sem versionamento ou histórico.

Estudo pode possuir série, número, título/tema, referência bíblica, arquivo/PDF, início/fim do período, autor/pastor e status.

`[CONFIRMADO]` Status iniciais: Rascunho, Programado e Publicado.

## IA futura

Original → processamento → resumo por IA → revisão/edição pastoral → publicação.

- `[CONFIRMADO]` IA auxilia; não publica interpretação oficial sem revisão pastoral.
