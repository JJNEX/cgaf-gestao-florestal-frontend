# Etapa 1 — build
FROM node:22 AS build

WORKDIR /app

# Instala dependências primeiro (melhora cache)
COPY package*.json ./
RUN npm install

# Copia o restante do projeto
COPY . .

# Build do Angular
RUN npm run build

# Etapa 2 — servir com nginx
FROM nginx:alpine


COPY --from=build /app/dist/webapp-cgaf-ucsal/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]