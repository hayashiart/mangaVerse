# Utilise une image Node.js pour construire
FROM node:18 AS build

# Définit le répertoire de travail
WORKDIR /app

# Copie les fichiers package.json et package-lock.json
COPY package*.json ./

# Installe les dépendances (inclut js-cookie)
RUN npm install

# Copie le reste des fichiers
COPY . .

# Construit l'application
RUN npm run build

# Utilise une image légère pour servir
FROM nginx:alpine

# Copie les fichiers construits dans le répertoire de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Expose le port 80 (Nginx)
EXPOSE 80

# Démarre Nginx
CMD ["nginx", "-g", "daemon off;"]