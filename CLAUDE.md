# Patas Unidas — contexto do projeto

Este arquivo é lido automaticamente pelo Claude Code no início de cada sessão. Ele descreve o
projeto, a arquitetura e as convenções que devem ser seguidas em qualquer alteração de código.

## Visão geral

Sistema de adoção de animais que conecta **ONGs** e **tutores**. ONGs cadastram animais
disponíveis; tutores se cadastram, definem preferências, favoritam pets (match), passam por
verificação de requisitos e concluem a documentação oficial de adoção.

- **Gerente do projeto:** Ingrid Ferreira
- **Patrocinador:** Pet Feliz Ltda

## Stack

- **Frontend:** React (Vite) + JavaScript
- **Backend:** Node.js + Express + JavaScript
- **Banco de dados:** PostgreSQL (roda **fora** do container da aplicação, via `docker-compose`)
- **Deploy:** uma única imagem Docker (multi-stage build) contendo frontend (build estático) e
  backend servindo tanto os assets quanto a API, na mesma porta.

## Arquitetura de deploy

```
docker-compose.yml
├── app (Dockerfile multi-stage: build do React + Express servindo /public e /api)
└── db  (Postgres, volume próprio)
```

O Express serve o build do React (`express.static`) e expõe as rotas de API sob `/api/*`. Não
há CORS em produção porque front e back respondem na mesma origem.

## Estrutura de pastas

### Backend — organizado por camada técnica

```
backend/src/
├── config/         # conexão com banco, variáveis de ambiente
├── controllers/     # recebe request, valida entrada, chama service, devolve response
├── services/         # regras de negócio
├── repositories/      # acesso a dados (queries/ORM)
├── models/             # entidades
├── routes/              # define endpoints, liga aos controllers
├── middlewares/          # auth, validação, tratamento de erro
├── utils/
└── app.js
backend/server.js         # ponto de entrada
```

Fluxo obrigatório de uma requisição: `route → controller → service → repository → model`.
Uma camada nunca pula para outra que não seja a imediatamente abaixo dela (ex: controller nunca
acessa repository diretamente).

Veja detalhes de convenção em `.claude/skills/backend-camadas/SKILL.md`.

### Frontend — components / pages / routes

```
frontend/src/
├── components/     # reutilizáveis, sem rota própria (common/, layout/, e uma pasta por domínio)
├── pages/           # uma pasta por tela, monta os componentes
├── routes/           # definição de rotas (react-router)
├── services/          # chamadas à API (um arquivo por recurso)
├── schemas/            # schemas Zod de validação de formulário, um por domínio
├── styles/              # design tokens (tokens.css) e estilos globais (global.css)
├── hooks/
├── contexts/
├── utils/
└── assets/
```

Veja detalhes de convenção em `.claude/skills/frontend-componentes/SKILL.md`.

Veja identidade visual (cores, espaçamento, tipografia) e o padrão de formulário com Zod +
react-hook-form em `.claude/skills/identidade-visual/SKILL.md`.

## Domínios do sistema (pacotes de trabalho)

| Domínio | Descrição |
|---|---|
| ONGs | cadastro e descrição dos animais presentes na ONG |
| Pets | cadastro e descrição de cada pet |
| Usuários/tutores | cadastro, preferências (filtros) e descrição para avaliação |
| Localização | filtros por cidade/estado |
| Adoção | favoritar (match), verificação de requisitos, documentação oficial |

## Convenções gerais

- **Nomes de arquivo:** camelCase para arquivos JS (`petService.js`), PascalCase para componentes
  React (`PetCard.jsx`).
- **Rotas de API:** REST, no plural, em português coerente com o domínio (`/api/ongs`,
  `/api/pets`, `/api/usuarios`, `/api/adocoes`).
- **Variáveis de ambiente:** nunca commitar `.env`; manter `.env.example` atualizado.
- **Commits:** mensagens no padrão `tipo: descrição curta` (ex: `feat: cadastro de ONGs`,
  `fix: validação de campos do pet`).
- **Não duplicar regra de negócio no frontend.** Validações de UX podem existir no front, mas a
  regra de verdade sempre vive no backend (`services/`).

## Comandos úteis

```bash
# Subir tudo (app + banco) localmente
docker compose up --build

# Rodar backend isolado (dev)
cd backend && npm install && npm run dev

# Rodar frontend isolado (dev, com proxy para /api)
cd frontend && npm install && npm run dev

# Rodar testes
cd backend && npm test
cd frontend && npm test
```

## O que evitar

- Não colocar lógica de negócio em `controllers/` — controller só orquestra.
- Não fazer o frontend chamar o banco ou qualquer serviço externo diretamente — sempre via
  `services/` do backend.
- Não hardcodar a URL do backend no frontend — usar `/api` relativo (mesma origem em produção).
