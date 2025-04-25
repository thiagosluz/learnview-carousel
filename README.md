# CINFO Painel

## Informações do Projeto

**URL**: xxxxxx

## Como executar o projeto

### Usando Docker

O projeto está configurado com Docker e Docker Compose para facilitar a execução. O ambiente inclui:
- Node.js para build
- Nginx como servidor web
- Certificados SSL auto-assinados para HTTPS local

Para executar o projeto usando Docker, siga os passos abaixo:

```sh
# Passo 1: Construir e iniciar os containers usando Docker Compose
docker compose up --build

# Para executar em segundo plano, adicione a flag -d
docker compose up -d --build
```

O aplicativo estará disponível em:
- HTTP: `http://localhost:80`
- HTTPS: `https://localhost:443`

Para parar os containers:
```sh
docker compose down
```

### Executando localmente

Para executar o projeto localmente sem Docker, você precisa ter Node.js & npm instalados - [instale usando nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Siga estes passos:

```sh
# Passo 1: Clone o repositório usando a URL Git do projeto
git clone <URL_DO_GIT>

# Passo 2: Entre no diretório do projeto
cd learnview-carousel

# Passo 3: Instale as dependências necessárias
npm i

# Passo 4: Inicie o servidor de desenvolvimento com auto-reloading e preview instantâneo
npm run dev
```

## Tecnologias Utilizadas

Este projeto foi construído com:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Docker
- Nginx


## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.