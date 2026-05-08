FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install -g typescript
RUN cd backend && npm install && npm run build
# Diagnostic : Lister tout pour trouver main.js
RUN find /app -name main.js
CMD ["ls", "-R", "/app"]