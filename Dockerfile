# Etapa 1: build do frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Etapa 2: backend + build do frontend copiado para dentro dele
FROM node:20-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm install --omit=dev
COPY backend/ .
COPY --from=frontend-build /app/frontend/dist ./public

EXPOSE 3000
# Aplica as migrations pendentes (idempotente, ver src/db/migrate.js) antes de subir o servidor.
CMD ["sh", "-c", "node src/db/migrate.js && node server.js"]
