# Santander Corretora · Analytics

Sistema interno de acompanhamento de produção da Santander Corretora.

## Como rodar localmente

```bash
npm install
npm start
```

Acesse: http://localhost:3000

## Credenciais de demonstração

| Campo | Valor |
|-------|-------|
| Login | `gustavogalioti.santander.com.br` |
| Senha | `1234` |

## Funcionalidades

- 🔐 Login com validação de domínio corporativo
- 📊 7 quadros de produção com drill-down
- 🔍 Filtros por Coordenador → TL → Assessor
- 📅 Filtro por mês (última base sempre selecionada por padrão)
- ⬆️ Upload de planilha de dados (admin)
- 📈 Hierarquia: HEAD → COORDENADOR → TL → ASSESSOR

## Domínios aceitos no cadastro

- @santander.com.br
- @santandercorretora.com.br
- @toroinvestimentos.com.br
- @santanderam

## Stack

- React 18
- JavaScript puro (sem dependências externas)
- Estilo inline (zero CSS frameworks)
