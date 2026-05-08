FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build || (ls -R /app && exit 1)
RUN ls -R /app
EXPOSE 3000
CMD ["node", "dist/main.js"]