FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN ls -la
RUN ls -la dist/ || echo "dist folder not found"
EXPOSE 3000
CMD ["node", "dist/main.js"]