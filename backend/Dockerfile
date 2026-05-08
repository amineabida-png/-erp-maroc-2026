FROM node:20-alpine
WORKDIR /app
# Force cache invalidation
RUN echo "2026-05-08-build-fix"
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN echo "Contenu du dossier après build :" && ls -R /app
EXPOSE 3000
CMD ["node", "dist/main.js"]