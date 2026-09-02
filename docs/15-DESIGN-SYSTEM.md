# Design System

## Autoridade visual provisória

- `[DECISÃO DE PRODUTO]` A implementação visual existente não é referência.
- `[DECISÃO DE PRODUTO]` O site público da Nova Igreja Batista é a fonte de verdade visual institucional.
- `[DECISÃO DE PRODUTO]` Sensação desejada: “Continuo na Nova Igreja Batista, agora dentro do meu espaço.”

## Tokens conhecidos

- `--navy: #060749`
- `--marfim: #EBEBDF`
- `--azul-gray: #A8AFB7`
- `--laranja: #FF7F40`
- `--laranja-soft: #ff9560`
- `--azul-luz: #7d9bd4`

`[CONFIRMADO]` Não copiar, baixar ou redistribuir arquivos proprietários de fonte; usar fallback de sistema até integração autorizada.

## Tipografia

- `[DECISÃO DE PRODUTO]` O site público usa conceitualmente a família “NIB Acumin v105”, com pesos de 300 a 800 e versão mobile própria. Ela é uma referência futura e só poderá ser integrada quando houver autorização e arquivos licenciados.
- `[DECISÃO DE PRODUTO]` Até essa integração, usar `system-ui, -apple-system, "Segoe UI", sans-serif` nos tokens `--font-body`, `--font-display` e `--font-editorial`.
- `[DECISÃO DE PRODUTO]` Pesos: corpo e secundário 400; editorial/itálico 500; labels, chapéus e botões 600; títulos de card 600 ou 700; títulos de seção e página 700.
- `[DECISÃO DE PRODUTO]` Peso 800 é excepcional e nunca padrão. Evitar aparência “Black” generalizada.
- `[DECISÃO DE PRODUTO]` A escala é própria de aplicação: título de página forte porém contido; título de seção menor; título de card menor; corpo confortável; eyebrow pequeno; metadata discreta.

## Tradução para o Portal

Herdar conceitualmente linguagem editorial, chapéus, proporções, botões, bordas, superfícies, hover, ritmo, identidade e responsividade, sem copiar cegamente o espaçamento de uma landing page para aplicação densa.

Evitar dashboard SaaS, Material Design genérico, estética bancária, ícones gigantes, círculos decorativos, sombras pesadas, excesso de navy, métricas decorativas, fotos fictícias e logo inventado.

## Famílias e controles

- Cards: Action Card, Informational Card e Person Card, com raio entre aproximadamente 12px e 16px, borda fina, pouca ou nenhuma sombra, superfícies claras e hover sem deslocamento exagerado.
- Quando a assinatura superior estiver prevista, o card exibe uma linha laranja (`#FF7F40`) curta em repouso. No hover, ela se expande suavemente da esquerda até o final do topo, respeitando o raio, sem deslocamento, alteração dimensional, layout shift ou sombra pesada. Com movimento reduzido, a transição é removida.
- Action Card: orientado a uma ação executável, com superfície clara, detalhe laranja controlado, título 600/700, corpo 400, bom respiro e CTA pill dominante. Não usar grande preenchimento navy.
- Informational Card: orientado a consulta e contexto, com superfície clara, título 600, texto secundário 400, divisores discretos e ação secundária. Não deve ser apresentado como pendência.
- `[DECISÃO DE PRODUTO]` Na Home, o Próximo Passo usa Action Card e tem maior prioridade visual; o Próximo Encontro da Célula usa Informational Card e tem prioridade secundária. A distinção deve vir de composição, espaço, borda, texto e hierarquia da ação, sem fundos escuros grandes, sombras ou escala exagerada.
- Person Card: composição textual hierarquizada; não usar avatar fictício como elemento dominante nem responsabilidades como coleção decorativa de badges.
- Estados semânticos discretos; “atenção” não significa automaticamente “perigo”.
- Botões: Primary Orange, Primary Navy, Ghost Light, Secondary e Text link; normalmente uma CTA dominante por contexto.
- Botões principais usam formato pill (`border-radius: 999px`), peso 600, altura contida, espaçamento horizontal confortável e transição suave.
- Botões usam somente texto por padrão. Não adicionar seta decorativa automaticamente a CTAs de card ou às variantes Primary, Secondary, Ghost Light e Text link.
- Links textuais continuam disponíveis quando semanticamente apropriados, também sem seta decorativa por padrão.
- Interactive Row / Navigation Row: superfície clara, borda sutil, conteúdo textual hierarquizado, área inteira clicável e chevron linear discreto opcional. Deve comunicar interatividade também em telas touch, preservar área mínima de toque, foco visível, feedback `:active` e hover discreto no desktop, sem assumir estética de botão grande. Pode apoiar Minha Jornada, listas de pessoas, encontros, configurações e navegação contextual.
- Primary Orange: fundo e borda `#FF7F40`, texto navy; hover marfim com texto navy.
- Primary Navy: fundo navy, texto marfim e hover controlado; usar apenas quando o contexto pedir.
- Laranja é assinatura e acento, não preenchimento indiscriminado.
- Formulários: labels sempre visíveis.
- Tabelas: desktop quando apropriado, com cards/adaptação mobile.

## Acessibilidade

Contraste, foco visível, teclado, touch target, sinais além da cor, labels persistentes, erros compreensíveis e HTML semântico.

`[DECISÃO DE PRODUTO]` Novos padrões visuais importantes exigem consulta e atualização deste documento.
