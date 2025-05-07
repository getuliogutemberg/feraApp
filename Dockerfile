# Build do Frontend
FROM node:18 AS build-frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend ./
RUN npm rebuild esbuild
RUN npm run build

# Build do Backend
FROM node:18 AS build-backend
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install --production
COPY backend ./

# Copia o build do frontend para o backend (se o backend servir os arquivos estáticos)
COPY --from=build-frontend /app/frontend/dist ./public

# Porta do backend
EXPOSE 3000

# Comando para rodar o backend
CMD ["node", "server.js"]