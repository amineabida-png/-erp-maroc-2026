# Frontend Dockerfile - Optimized for Railway Monorepo
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY . .
EXPOSE 3000
# On utilise la commande de dev pour éviter le build long
CMD ["npm", "run", "dev"]
