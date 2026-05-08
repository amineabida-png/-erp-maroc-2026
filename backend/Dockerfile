FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
# On liste tout le contenu de /app pour voir où sont les fichiers
CMD ["ls", "-R", "/app"]