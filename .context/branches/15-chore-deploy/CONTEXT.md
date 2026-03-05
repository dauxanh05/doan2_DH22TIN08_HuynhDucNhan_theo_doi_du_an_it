# 15-chore-deploy - Context

> **Loai:** chore | **Phu thuoc:** 14-feat-polish

## Reference
- `context/overview.md` - DevOps tech stack (Docker, Nginx, PM2)
- `CLAUDE.md` - Environment variables

## Scope

Setup production deployment tren VPS co san.

### Docker Production
- Dockerfile cho API (NestJS)
- Dockerfile cho Web (React build -> Nginx serve)
- docker-compose.production.yml

### Nginx
- Reverse proxy: domain -> API (port 3000) + Web (port 80)
- SSL/TLS (Let's Encrypt)
- Gzip compression
- Static file caching

### PM2
- Process manager cho NestJS API
- ecosystem.config.js
- Auto restart, log management
- Cluster mode (optional)

### CI/CD (GitHub Actions)
- Workflow: push to main -> build -> test -> deploy
- SSH deploy to VPS
- Environment secrets

### Domain & SSL
- Domain: devteamos.me (da co)
- SSL: Let's Encrypt (certbot)
- Auto-renew certificate

## Rules
- Khong expose database port ra ngoai
- Environment variables qua .env (khong commit)
- Health check endpoint cho monitoring
- Backup strategy cho database
