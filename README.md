# Portal Nova Igreja Batista

Base inicial do portal interno da Nova Igreja Batista. A experiência é orientada pelas responsabilidades, pelo contexto atual e pelos próximos passos de cada pessoa. Esta primeira versão é navegável e usa somente dados demonstrativos.

## Stack

- Next.js com App Router
- React e TypeScript
- ESLint
- CSS global organizado por design tokens

## Executar localmente

Requisitos: Node.js 20.9 ou superior e npm.

```bash
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

Para validar a versão de produção:

```bash
npm run lint
npm run build
npm start
```

## Estrutura inicial

- `app/`: rotas, layout global, metadados e estilos
- `components/`: componentes reutilizáveis da interface
- `data/`: dados demonstrativos e definições de navegação
- `AGENTS.md`: princípios do produto, linguagem e decisões arquiteturais

Não há banco de dados, autenticação real ou integrações externas nesta etapa.
