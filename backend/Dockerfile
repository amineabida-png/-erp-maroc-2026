# Backend Dockerfile - Optimized for Railway Monorepo
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY . .
EXPOSE 3000
CMD ["node", "src/main.js"]
