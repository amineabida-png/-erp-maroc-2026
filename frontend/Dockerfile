FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY . .
# En mode démo, on lance directement sans le build lourd de Next.js
EXPOSE 3000
CMD ["npm", "run", "dev"] 
