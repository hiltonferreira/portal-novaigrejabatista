# Fluxo demonstrativo integrado de encontro

## Escopo desta etapa

Implementação do ciclo estudo semanal → encontro → presença/visitantes → relatório → visualização pelo Líder, com dados demonstrativos. Não adiciona autenticação, banco, notificações, integrações externas ou regras eclesiais.

## Estado compartilhado

`DemoProvider`, no layout raiz, mantém estudos, programação, encontros criados e operações por ID de encontro. As alterações sobrevivem à navegação interna via links Next.js, mas uma recarga, nova aba ou encerramento da página reinicia a demonstração. Não usar dados pessoais reais.

- A programação resolve o estudo pela semana de segunda a domingo.
- Correções pastorais de metadados e PDFs aparecem nas consultas do encontro e da comunidade.
- URLs temporárias de PDFs pertencem à sessão raiz; sair da tela pastoral não as invalida.
- Presença, visitantes e narrativa usam o mesmo ID de encontro.
- O estado de relatório segue Rascunho → Enviado ao Líder → Visualizado pelo Líder.
- Abrir a lista de relatórios não registra leitura. Acionar “Visualizar relatório” registra a leitura no mock.
- O relatório enviado preserva uma cópia da presença, narrativa e identificação textual do estudo daquele envio. Alterações posteriores não modificam silenciosamente esse conteúdo.
- Correção/reenvio após envio não está implementado. Essa limitação do protótipo não estabelece uma política definitiva da igreja.
- O relatório informa também pessoas sem registro de presença; ausência não é inferida automaticamente.

## Consulta do Líder

`/lideranca/relatorios` é uma demonstração explícita de consulta do Líder, acessível pela área de Liderança. Não equivale a conceder autoridade de Líder à Maria, que continua com seu perfil demonstrativo original. Não há troca de perfil nem autorização real. A implementação segura por identidade, responsabilidade e contexto permanece na fase futura de autenticação.

Minha Célula exibe somente o estudo e o contexto comunitário; o componente público de estudo não apresenta narrativas, relatórios ou ausências de terceiros. Essa separação de interface não substitui futura proteção dos dados no servidor.

## Roteiro de revisão

1. Abrir `/pastor/estudos`, corrigir o título do estudo programado para a semana de 07/09/2026 e, se desejado, adicionar um PDF de teste.
2. Usando navegação interna, abrir Minha Célula e conferir o título/PDF. Usar links internos é necessário para preservar a sessão.
3. Abrir `/secretaria/encontros/genesis-2026-09-08/presenca`, alterar uma presença e adicionar um visitante fictício.
4. Abrir a aba Relatório e conferir os totais e visitantes. Preencher a narrativa, navegar para outra aba e retornar.
5. Enviar ao Líder. Abrir Liderança → Relatórios da célula e visualizar o relatório.
6. Retornar ao relatório da Secretaria e conferir “Visualizado pelo Líder”.
7. Abrir outro encontro: presença e narrativa devem ser independentes. Semana sem programação deve apresentar “Estudo a definir”.

## Limites preservados

Home e alguns resumos ainda usam datas fixas do cenário inicial de setembro de 2026. Históricos antigos continuam demonstrativos e não são convertidos em relatórios completos inventados. Comunicação dos encontros adicionais e a integração do planejamento de lanche permanecem fora desta entrega. A política para corrigir relatórios enviados deve ser definida antes de implementá-la.
