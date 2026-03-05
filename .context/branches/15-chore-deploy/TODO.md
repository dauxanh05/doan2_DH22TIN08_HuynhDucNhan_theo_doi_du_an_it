# 15-chore-deploy - TODO

## Docker
- [ ] Dockerfile cho API (multi-stage build)
- [ ] Dockerfile cho Web (build + nginx serve)
- [ ] docker-compose.production.yml
- [ ] .dockerignore files

## Nginx
- [ ] Nginx config (reverse proxy)
- [ ] SSL/TLS setup (Let's Encrypt)
- [ ] Gzip compression
- [ ] Static file caching headers
- [ ] Security headers

## PM2
- [ ] ecosystem.config.js
- [ ] Auto restart configuration
- [ ] Log management
- [ ] Health check

## CI/CD
- [ ] GitHub Actions workflow (.github/workflows/deploy.yml)
- [ ] Build step
- [ ] Deploy step (SSH to VPS)
- [ ] Environment secrets setup

## Domain & SSL
- [ ] Domain DNS configuration (devteamos.me)
- [ ] SSL certificate (certbot)
- [ ] Auto-renew setup

## Database
- [ ] Production database setup
- [ ] Backup strategy / cron job
- [ ] Migration strategy cho production

## Test manual
- [ ] Test Docker build local
- [ ] Test docker-compose.production.yml
- [ ] Test Nginx reverse proxy
- [ ] Test SSL certificate
- [ ] Test CI/CD pipeline
- [ ] Test health check endpoint
