# ALG Tech Hub - Site Institucional

Site institucional da ALG Soluções em Tecnologia: frontend React (Vite, pré-renderizado) e backend FastAPI + MySQL, rodando em VPS.

## Estrutura

```
backend/
  server_mysql.py        # API FastAPI (contato e orçamento)
  requirements_mysql.txt
  .env.example           # copie para .env (nunca commitar o .env)
frontend/
  index.html             # entrada do Vite
  src/                   # pages, components, data/services.js, utils/seo.js
  scripts/prerender.mjs  # gera HTML estático de cada rota + sitemap.xml
  public/                # favicon, manifest, robots.txt, assets
  .env.production        # configuração pública de produção (sem segredos)
database/mysql_schema.sql
docs/                    # guias de SMTP/Gmail, migração e exemplo de nginx
deploy.sh                # atualização na VPS
```

## Desenvolvimento

Frontend:

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev        # http://localhost:5173
npm run build      # build + pré-renderização em frontend/build
```

Backend:

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements_mysql.txt
cp .env.example .env   # preencha as credenciais
python server_mysql.py
```

## Segurança

- Credenciais ficam somente em `backend/.env`, que está no `.gitignore`.
- `GET /api/contact` exige o header `X-Admin-Token` igual a `ADMIN_TOKEN`; sem a variável, a rota fica desabilitada.
- CORS restrito a `CORS_ORIGINS`; formulários têm rate limit por IP (`RATE_LIMIT_MAX`/`RATE_LIMIT_WINDOW`) e campo honeypot.
- Analytics (PostHog) só carrega depois do aceite no banner de cookies.

## Deploy na VPS

Veja `deploy.sh` e `docs/nginx.conf.example`. Resumo: `git pull`, `npm ci && npm run build` no frontend, reiniciar o serviço do backend e recarregar o nginx.

## Documentação adicional

- [`docs/GMAIL_SMTP_SETUP.md`](./docs/GMAIL_SMTP_SETUP.md): passo a passo do Gmail SMTP
- [`docs/SMTP_CONFIG.md`](./docs/SMTP_CONFIG.md): configuração geral de SMTP
- [`docs/MIGRATION_GUIDE.md`](./docs/MIGRATION_GUIDE.md): histórico da migração EmailJS para SMTP
