
# Estágio de build
FROM node:22-alpine AS build

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de package.json e package-lock.json
COPY package*.json ./

# Instala as dependências com cache limpo e produção
RUN npm ci --production=false

# Copia o resto dos arquivos do projeto
COPY . .

# Compila o projeto
RUN npm run build

# Estágio de produção
FROM nginx:stable-alpine

# Install OpenSSL
RUN apk add --no-cache openssl

# Create SSL directory
RUN mkdir -p /etc/nginx/ssl

# Generate self-signed certificate
RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/nginx.key \
    -out /etc/nginx/ssl/nginx.crt \
    -subj "/C=BR/ST=State/L=City/O=Organization/CN=localhost"

# Copia a configuração personalizada do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia os arquivos buildados para o diretório do Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Expose ports
EXPOSE 80 443

# Inicia o Nginx
CMD ["nginx", "-g", "daemon off;"]
