FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install -g typescript
# Aller dans backend pour builder et s'assurer que le dist est généré correctement
RUN cd backend && npm install && npm run build
# Corriger le CMD pour pointer vers le chemin correct généré dans le sous-dossier
CMD ["node", "backend/dist/main.js"]