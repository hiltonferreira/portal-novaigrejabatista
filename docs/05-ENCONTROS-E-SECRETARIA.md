# Encontros e Secretaria

## Encontro de Célula

`[DECISÃO DE PRODUTO]` Encontro é entidade compartilhada, com interação conforme responsabilidade.

Fluxo conceitual: estudo publicado → encontro preparado → escala/lanche/comunicação → encontro acontece → presença/visitantes/estudo efetivamente ministrado → Secretaria registra → relatório → informações derivadas → acompanhamento → próximo encontro.

## Secretaria da Célula

- `[CONFIRMADO]` A Secretaria registra o encontro e prepara o relatório; o Líder não é o responsável primário por preenchê-lo.
- `[CONFIRMADO]` Responsabilidades: aniversários, comunicação no WhatsApp, organização mensal do lanche, gestão de pessoas no grupo quando aplicável, comunicação do encontro, presença, visitantes, informações do encontro e relatório.
- `[CONFIRMADO]` Escala de serviço é somente leitura para Secretaria quando não houver outra permissão.
- `[DECISÃO DE PRODUTO]` Área: Visão Geral, Encontros, Lanche, Pessoas e Histórico.
- `[DECISÃO DE PRODUTO]` Visão Geral, Encontros, Lanche, Pessoas e Histórico permanecem disponíveis em uma navegação interna compartilhada, leve e editorial. Em telas estreitas, essa navegação pode rolar horizontalmente e deve indicar conteúdo oculto sem reduzir a tipografia nem cortar palavras.
- `[DECISÃO DE PRODUTO]` A navegação entre Visão Geral, Comunicação, Presença e Relatório de um encontro específico pertence a outra hierarquia e permanece contextual ao mesmo encontro.
- `[DECISÃO DE PRODUTO]` A organização mensal do lanche parte da recorrência habitual configurada na Célula (um dia e horário semanais no MVP) e prefere os dados do Encontro concreto quando ele já existe para a mesma data. A projeção serve ao planejamento e não cria automaticamente um Encontro definitivo.
- `[DECISÃO DE PRODUTO]` Meses passados sem registro são somente históricos e não permitem criação retroativa. No mês atual, apenas hoje e datas futuras podem receber nova organização; registros passados existentes permanecem visíveis. Meses futuros podem ser preparados antecipadamente.
- `[DECISÃO DE PRODUTO]` O planejamento pode ser parcial. A Secretaria não inventa pessoas, responsáveis ou eventos especiais, e a mensagem copiável inclui somente organizações efetivamente preenchidas.
- `[LIMITAÇÃO ATUAL]` Sem uma relação explícita entre uma exceção de calendário e a ocorrência recorrente substituída, o Portal não presume essa associação. Exceções avançadas, cancelamentos e mudanças de data serão modelados posteriormente.

## Relatório

`[CONFIRMADO]` Estados: Rascunho → Enviado ao Líder → Visualizado pelo Líder.

`[PENDENTE]` Não criar etapa “Aprovado” sem decisão explícita futura.
