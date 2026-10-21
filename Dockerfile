# Etapa 1: Base con Node.js 24 Alpine
FROM node:24-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Target para Desarrollo local en Docker Desktop
FROM base AS dev
EXPOSE 3000
CMD ["npm", "run", "dev"]

# Target para Compilación de Producción
FROM base AS builder
RUN npm run build

# Target para Producción (Nginx Alpine idéntico a Ubuntu Server)
FROM nginx:alpine AS prod
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
