FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install -g typescript
RUN cd backend && npm install && npm run build
CMD ["node", "backend/dist/main.js"]