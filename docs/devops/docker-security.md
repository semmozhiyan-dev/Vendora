# Docker Security Guide

Comprehensive security best practices for Vendora Docker deployments.

## Table of Contents
- [Secrets Management](#secrets-management)
- [Image Security](#image-security)
- [Network Security](#network-security)
- [File Permissions](#file-permissions)
- [Secret Rotation](#secret-rotation)
- [Audit Logging](#audit-logging)

## Secrets Management

### What to Keep Secret

- API Keys (Razorpay, SendGrid, etc.)
- Database Credentials
- JWT Secret
- Email Passwords
- Webhook Secrets
- OAuth Tokens
- Private Keys

### Never

❌ Commit `.env` files with real credentials  
❌ Expose secrets in Dockerfiles  
❌ Pass secrets as command-line arguments  
❌ Log secrets to stdout/stderr  
❌ Store secrets in image layers  
❌ Share secrets in documentation  
❌ Use weak/default secrets in production  

### Always

✓ Use `.env.example` templates  
✓ Store actual secrets in secure vault  
✓ Use environment variables  
✓ Rotate secrets regularly  
✓ Audit secret access  
✓ Use strong, random secrets  
✓ Restrict secret access by role  

### Generating Secure Secrets

```bash
# JWT Secret (256-bit = 64 hex chars)
openssl rand -hex 32

# Database Password (256-bit)
openssl rand -base64 32

# API Secret (128-bit)
openssl rand -hex 16

# Database Root Password
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

### Environment-Specific Setup

#### Development

- Use `.env.development` with dummy credentials
- Store in project (not git)
- Local MongoDB with default credentials
- Test API keys

#### Staging

- Use secure secrets manager (AWS Secrets Manager, HashiCorp Vault)
- Real but staging-specific credentials
- Staging MongoDB Atlas cluster
- Staging Razorpay account

#### Production

- Use production secrets manager
- Real, production credentials
- Production MongoDB Atlas cluster
- Production Razorpay account
- Enable MFA for secrets access

### Docker Compose Secrets (Swarm Mode)

```bash
# Create secret
echo "your_secret_value" | docker secret create jwt_secret -

# Use in docker-compose.yml
services:
  backend:
    secrets:
      - jwt_secret
    environment:
      JWT_SECRET_FILE: /run/secrets/jwt_secret

# In application code
cat /run/secrets/jwt_secret
```

### Kubernetes Secrets

```yaml
# Create secret
kubectl create secret generic vendora-secrets \
  --from-literal=jwt-secret=<value> \
  --from-literal=db-password=<value>

# Use in deployment
env:
  - name: JWT_SECRET
    valueFrom:
      secretKeyRef:
        name: vendora-secrets
        key: jwt-secret
```

### AWS ECS Secrets

```json
{
  "secrets": [
    {
      "name": "JWT_SECRET",
      "valueFrom": "arn:aws:secretsmanager:us-east-1:account-id:secret:vendora/jwt-secret"
    }
  ]
}
```

### Azure Key Vault

```bash
# Store secrets
az keyvault secret set --vault-name vendora \
  --name jwt-secret --value <value>

# Reference in container
az container create \
  --registry-login-server myregistry.azurecr.io \
  --environment-variables \
  JWT_SECRET=$(az keyvault secret show --name jwt-secret --query value)
```

## Image Security

### Vulnerability Scanning

```bash
# Docker Scout (built-in, recommended)
docker scout cves vendora-backend:latest

# Trivy (external tool)
trivy image vendora-backend:latest

# Grype (alternative)
grype vendora-backend:latest
```

### Secure Build Practices

```dockerfile
# ❌ WRONG - Secret in layer
FROM node:20-slim
ARG DB_PASSWORD
RUN npm install --db-password=$DB_PASSWORD

# ✓ CORRECT - Secret not cached
FROM node:20-slim
RUN --mount=type=secret,id=db_pass npm install

# ✓ CORRECT - Multi-stage, secrets not in final image
FROM node:20-slim AS builder
RUN --mount=type=secret,id=npm_token npm ci
FROM node:20-slim
COPY --from=builder /app/node_modules /app/node_modules
```

### Base Image Selection

- Use slim variants (smaller attack surface)
- Use specific versions (not `latest`)
- Prefer official images
- Check CVE database before using

```dockerfile
# Good
FROM node:20.11.0-slim

# Avoid
FROM node:latest
FROM ubuntu:latest
FROM custom/untrusted-image:latest
```

### Remove Unnecessary Tools

```dockerfile
FROM node:20-slim

# Remove apt cache and package lists
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Remove build tools from final image (multi-stage)
FROM node:20-slim AS builder
# ... build steps ...

FROM node:20-slim
COPY --from=builder /app/dist /app/dist
```

## Network Security

### Expose Only Necessary Ports

```yaml
services:
  mongodb:
    # Don't expose to host in production
    ports: []
    
  backend:
    ports:
      - "5000:5000"  # Only internal traffic
    
  frontend:
    ports:
      - "80:80"
```

### Internal-Only Services

```yaml
services:
  mongodb:
    networks:
      - vendora-network  # Only internal network
    # No ports section - completely internal
```

### Network Policies (Kubernetes)

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: backend-db-only
spec:
  podSelector:
    matchLabels:
      app: backend
  policyTypes:
    - Ingress
    - Egress
  ingress:
    - from:
        - podSelector:
            matchLabels:
              app: frontend
  egress:
    - to:
        - podSelector:
            matchLabels:
              app: mongodb
```

### Rate Limiting

```javascript
// Express rate limiting (already configured)
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many requests',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);
```

## File Permissions

### Container Permissions

```bash
# Check permissions in running container
docker exec vendora-backend ls -la /app

# Expected output:
# drwxr-xr-x node   node   /app
# drwxr-xr-x node   node   /app/src
# drwxrwx--- node   node   /app/logs
# (no world-readable secrets)
```

### Non-Root User

```dockerfile
# Create non-root user
USER node

# Run container as non-root
docker run -u node:node vendora-backend:latest
```

### Sensitive File Protection

```dockerfile
# Make secrets files readable only by owner
RUN chmod 600 /app/.env

# Make directories accessible only by owner
RUN chmod 700 /app/secrets
```

## Secret Rotation

### Rotation Schedule

| Secret | Frequency | Impact |
|--------|-----------|--------|
| JWT_SECRET | 90 days | Restart required |
| API Keys | 180 days | Restart required |
| DB Password | 6 months | Database + app restart |
| SSL/TLS Cert | Annually | Web server restart |

### Rotation Process

1. **Generate New Secret**
   ```bash
   openssl rand -hex 32  # New JWT_SECRET
   ```

2. **Update Secrets Manager**
   - AWS Secrets Manager
   - HashiCorp Vault
   - Azure Key Vault
   - Kubernetes Secrets

3. **Deploy with Grace Period**
   - Keep old secret for 24 hours
   - Accept both old and new
   - Monitor for errors

4. **Verify New Secret Works**
   - Test API endpoints
   - Check logs for errors
   - Verify authentication works

5. **Revoke Old Secret**
   - After 24-hour grace period
   - Document rotation in changelog

### Automated Rotation (Recommended)

```bash
#!/bin/bash
# Secret rotation script

# Generate new secret
NEW_JWT_SECRET=$(openssl rand -hex 32)

# Update in secrets manager
aws secretsmanager update-secret \
  --secret-id vendora/jwt-secret \
  --secret-string "$NEW_JWT_SECRET"

# Restart containers
docker compose restart backend frontend

# Wait for health checks
sleep 30

# Verify
curl http://localhost:5000/health
```

## Audit Logging

### Container Logs

```bash
# View recent logs
docker logs --tail 100 vendora-backend

# Follow logs in real-time
docker logs -f vendora-backend

# With timestamps
docker logs --timestamps vendora-backend

# Filter by pattern
docker logs vendora-backend | grep ERROR
docker logs vendora-backend | grep "authentication"
```

### Important Events to Log

- Authentication failures
- Authorization denials
- Configuration changes
- Secret access/rotation
- Database connection changes
- API rate limit exceeded
- Invalid input detected

### Log Aggregation (Production)

```bash
# Send logs to centralized service
docker run \
  --log-driver splunk \
  --log-opt splunk-token=<token> \
  --log-opt splunk-url=<url> \
  vendora-backend:latest
```

### Monitoring Logs

```bash
# Setup monitoring/alerting
# Alert on:
# - Authentication failures
# - Too many errors
# - Secret rotation
# - Security violations
```

## Secrets in Git

### Git History Scan

```bash
# Scan entire history for secrets
git log -p --all | grep -i "password\|secret\|token\|api.key"

# Scan current files
git grep -n "password\|secret\|api_key"

# Use dedicated tools
# - git-secrets
# - detect-secrets
# - TruffleHog
```

### If Secret Exposed

1. **Immediately Rotate Secret**
   ```bash
   NEW_SECRET=$(openssl rand -hex 32)
   # Update in secrets manager
   ```

2. **Rewrite Git History** (if not shared)
   ```bash
   git filter-branch --force --index-filter \
     'git rm --cached --ignore-unmatch .env' \
     --prune-empty --tag-name-filter cat -- --all
   ```

3. **Force Push** (if safe)
   ```bash
   git push origin --force --all
   ```

4. **Audit Access Logs**
   - Check who accessed the repository
   - Monitor for suspicious activity

5. **Monitor Secret**
   - Watch for unauthorized use
   - Set up alerts

## Checklist

- [ ] `.env` files in `.gitignore`
- [ ] `.env.example` has only placeholders
- [ ] No secrets in Dockerfiles
- [ ] Non-root user in containers
- [ ] Health checks implemented
- [ ] Rate limiting enabled
- [ ] Secrets rotated per schedule
- [ ] Logs aggregated and monitored
- [ ] Security scanning enabled
- [ ] Network policies configured
- [ ] Backup and recovery tested
- [ ] Incident response plan documented

## Resources

- [OWASP Container Security](https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html)
- [Docker Security Best Practices](https://docs.docker.com/develop/security-best-practices/)
- [CIS Docker Benchmark](https://www.cisecurity.org/benchmark/docker)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)

---

**Last Updated:** May 6, 2026  
**Version:** 1.0
