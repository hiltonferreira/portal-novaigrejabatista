# Pessoas e Vínculos

## Pessoa e Conta

- `[DECISÃO DE PRODUTO]` `Pessoa` é a entidade central.
- `[CONFIRMADO]` Uma Pessoa não é duplicada por acumular vínculos, responsabilidades, participação ou habilitações.
- `[DECISÃO DE PRODUTO]` Pessoa e Conta de acesso são entidades distintas. Pessoa pode existir sem login; uma Conta pertence opcionalmente a uma Pessoa.
- `[DECISÃO DE PRODUTO]` A Conta adapta a experiência às responsabilidades da Pessoa, sem troca de perfil.

## Vínculo com a igreja

- `[CONFIRMADO]` Vínculos mutuamente exclusivos: Visitante, Frequentador e Membro.
- `[CONFIRMADO]` Transições de vínculo nunca são automáticas; exigem confirmação humana.
- `[DECISÃO DE PRODUTO]` Preservar futuramente histórico, data, responsável pela alteração e observação opcional.
- `[PENDENTE]` Critérios formais para tornar-se Membro.
- `[CONFIRMADO]` Não inventar requisitos como batismo ou conclusão da Jornada DNA.

## Responsabilidades e características

Uma Pessoa pode acumular Líder, Líder em Treinamento, Secretário/Secretária, Anfitrião/Anfitriã, Supervisor/Supervisora, Coordenador/Coordenadora, Pastor/Pastora e Secretaria Pastoral, além de participação e habilitações de serviço.

- `[DECISÃO DE PRODUTO]` Nunca usar um único campo `funcao` para representar tudo.
- `[CONFIRMADO]` “Novo convertido” é característica independente da Pessoa, não vínculo.
- `[DECISÃO DE PRODUTO]` Distinguir total histórico de visitas e sequência consecutiva atual; contagens são derivadas de registros.
