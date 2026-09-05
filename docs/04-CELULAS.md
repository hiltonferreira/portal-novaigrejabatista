# Células

## Estrutura conceitual

`[CONFIRMADO]` Uma Célula possui:

- Identificação: nome, status, origem, célula de origem quando aplicável, datas de início e encerramento.
- Funcionamento: dia da semana, horários inicial/final e local atual.
- Estrutura: Rede derivada/contextual, Supervisão, Líder, Líderes em Treinamento, Secretaria, anfitriões e participantes.
- Histórico: locais, lideranças, participações e multiplicações.

`[DECISÃO DE PRODUTO]` Quando a precisão histórica disponível for somente o ano em que a Célula começou ou foi estabelecida, representá-la como ano (`establishedYear`) sem inventar dia e mês. Essa informação histórica não deve ser inferida de `createdAt`, que representa a criação técnica do registro.

## Status e origem

- `[CONFIRMADO]` Status: Em implantação, Ativa ou Inativa.
- `[CONFIRMADO]` Origem: Original ou Multiplicação.
- `[CONFIRMADO]` “Multiplicada” não é status; uma célula pode continuar ativa depois de multiplicar.

## Minha Célula

`[DECISÃO DE PRODUTO]` É um espaço comunitário digital, não painel administrativo. Estrutura: Visão Geral, Pessoas, Encontros e Escalas.

Membro pode visualizar, conforme aplicável: próximo encontro, estudo oficial, própria participação e disponibilidade, liderança, local, aniversários e informações comunitárias.

Membro não recebe acesso geral a relatórios internos, observações privadas, ausências de terceiros, Jornada DNA de terceiros, permissões de terceiros, histórico pastoral ou dados financeiros de terceiros.
