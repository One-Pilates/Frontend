# ─────────────────────────────────────────────
# Etapa 1: Build da aplicação Vite/React
# ─────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copia dependências primeiro (aproveita cache do Docker)
COPY package*.json ./
RUN npm ci

# Copia o restante do projeto
COPY . .

# Variáveis de build injetadas via --build-arg no docker build
# Exemplo: docker build --build-arg VITE_BASE_URL_API=http://minha-api.com ...
ARG VITE_BASE_URL_API
ARG VITE_EMAILJS_SERVICE_ID
ARG VITE_EMAILJS_TEMPLATE_ID
ARG VITE_EMAILJS_PUBLIC_KEY
ARG VITE_USE_MOCKS=false

# Exporta os ARGs como variáveis de ambiente para o Vite ler durante o build
ENV VITE_BASE_URL_API=$VITE_BASE_URL_API
ENV VITE_EMAILJS_SERVICE_ID=$VITE_EMAILJS_SERVICE_ID
ENV VITE_EMAILJS_TEMPLATE_ID=$VITE_EMAILJS_TEMPLATE_ID
ENV VITE_EMAILJS_PUBLIC_KEY=$VITE_EMAILJS_PUBLIC_KEY
ENV VITE_USE_MOCKS=$VITE_USE_MOCKS

# Gera o build de produção (saída em /app/dist)
RUN npm run build

# ─────────────────────────────────────────────
# Etapa 2: Servir os arquivos estáticos com NGINX
# ─────────────────────────────────────────────
FROM nginx:1.27-alpine AS runner

# Remove o conteúdo padrão do NGINX
RUN rm -rf /usr/share/nginx/html/*

# Copia os arquivos gerados pelo Vite
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia a configuração customizada do NGINX
# (suporte a React Router + gzip + cache de assets)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Porta HTTP padrão
EXPOSE 80

# Inicia o NGINX em foreground (obrigatório para Docker)
CMD ["nginx", "-g", "daemon off;"]