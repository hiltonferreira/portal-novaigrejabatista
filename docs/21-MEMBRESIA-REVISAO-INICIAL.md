# Membresia — revisão inicial

01/11/2026. Proposta em docs/20-MEMBRESIA-DEFINICAO-INICIAL.md. Nenhuma aprovação de implementação.

Claude respondeu pelo fluxo existente: https://github.com/hiltonferreira/novaigrejabatista/issues/11#issuecomment-6562479108 . Execução: https://github.com/hiltonferreira/novaigrejabatista/actions/runs/41339716810 . Codex leu a resposta integral.

## Limite da revisão

Claude leu regras e proposta no repositório do site, mas sua ferramenta negou acesso ao Portal. Portanto sua revisão é de coerência da proposta, não verificação independente do código ou das regras do Portal. Não conferiu os SHAs do Portal nem o Preview. Codex verificou diretamente documentos e trechos do código no head d1e3dacec1d299c1ce76b10f2bd32b69cfdbfccc. Revisão cruzada do código segue pendente, por acesso de leitura ou envio de trechos públicos verificáveis.

## Convergências

Separar Pessoa/Conta/vínculo, decisão humana, cadastro sem conta/célula e isolamento de eventos em produção. Nenhuma alteração funcional, migration, merge ou deploy.

## Pendências incorporadas

- Identificar quem decide membresia e quem registra; confirmar critérios formais antes da tela de decisão.
- Definir finalidade, obrigatoriedade e retenção dos campos; matriz por campo e ação para cada responsabilidade/contexto.
- Definir tratamento de menores, responsáveis e visibilidade antes da tela de cadastro.
- Definir quem resolve suspeitas de duplicidade; não mesclar automaticamente nem usar telefone como identidade única.
- Decidir se autosserviço entra no primeiro recorte; requer conta e fila de revisão.
- Definir transferência, inativação e encerramento sem confundir com os vínculos exclusivos.
- Auditoria geral precisa ser desenhada: a atual exige encontro; não é reaproveitamento direto.

## Responsáveis e próximo marco

Codex consolida diagnóstico e proposta, Claude revisa dentro dos limites efetivos, Hilton valida decisões e telas. Conferência do Preview depende da autorização da equipe Vercel (403 atual); não houve teste remoto nesta etapa. Próximo marco: concluir diagnóstico remoto e validar objetivo/acessos/dados/fluxos com Hilton. Depois preparar telas fictícias; programar somente após validação das telas.
