# backend/Dockerfile – VERSION CORRIGÉE
FROM node:18-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

FROM node:18-alpine
WORKDIR /app

RUN addgroup -g 1001 nodejs && adduser -S -u 1001 nodejs

COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules

# COPIE TOUT LE CODE + LE DOSSIER MANGAS
COPY --chown=nodejs:nodejs . .

EXPOSE 5000

USER nodejs

CMD ["node", "app.js"]