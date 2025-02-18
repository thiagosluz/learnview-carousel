
# Use a imagem oficial do Node.js como base
FROM node:20-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de package.json primeiro para aproveitar o cache do Docker
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o resto dos arquivos do projeto
COPY . .

# Compila o projeto
RUN npm run build

# Expõe a porta 5173 que o Vite usa por padrão
EXPOSE 5173

# Comando para iniciar a aplicação
CMD ["npm", "run", "dev", "--", "--host"]
