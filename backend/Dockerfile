# Utilise une image Node.js officielle
FROM node:18

# Définit le répertoire de travail
WORKDIR /app

# Copie les fichiers package.json et package-lock.json
COPY package*.json ./

# Installe les dépendances
RUN npm install

# Copie les images mangas
COPY mangas/ ./mangas/

# Copie le reste des fichiers
COPY . .

# Expose le port 5000
EXPOSE 5000

# Commande pour démarrer l'application
CMD ["node", "app.js"]