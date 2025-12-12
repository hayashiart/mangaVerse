# frontend-vite/Dockerfile – Version 2025 (légère amélioration)
FROM node:18-alpine AS build
WORKDIR /app

# Copie package.json + lock
COPY package*.json ./
RUN npm ci

# Copie tout le code source
COPY . .

# Variables d’environnement pour le build (optionnel mais propre)
ARG VITE_BACKEND_URL=https://tondomaine.com/api
ENV VITE_BACKEND_URL=${VITE_BACKEND_URL}

# Build de production
RUN npm run build -- --mode production

# Étape finale : Nginx ultra léger
FROM nginx:alpine

# Copie le build React
COPY --from=build /app/dist /usr/share/nginx/html

# Copie une config Nginx sécurisée (fortement recommandé)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposition ports
EXPOSE 80 443

# Nginx en foreground
CMD ["nginx", "-g", "daemon off;"]