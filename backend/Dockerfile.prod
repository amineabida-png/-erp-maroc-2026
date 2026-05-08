FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Débogage : Afficher la version de tsc et tenter de compiler avec des détails
RUN ./node_modules/.bin/tsc --version
RUN ./node_modules/.bin/tsc -p . --listEmittedFiles --extendedDiagnostics
RUN ls -R /app
EXPOSE 3000
CMD ["node", "dist/main.js"]