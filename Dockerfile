FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install -g typescript
# Build dans backend
RUN cd backend && npm install && npm run build
# Diagnostic : Vérifier où est main.js
RUN find /app -name main.js
# Exécuter directement le chemin trouvé (ceci va échouer s'il n'existe pas, mais on aura le log)
CMD node $(find /app -name main.js)