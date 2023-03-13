# Vagas Tech RN Bot

Realiza postagens de vagas na área tech situadas no estado do Rio Grande do Norte ou remotas, no canal [vagastechrn](https://t.me/s/vagastechrn).

## Requerimentos

- Node.js
- Npm
- Docker
- Knex CLI

## Desenvolvimento

Antes de mais nada, copie o arquivo `.env.example` para um arquivo chamado `.env` e mude as variáveis de ambiente de acordo com o arquivo exemplo.

```sh
# Suba os containers necessários para rodar a aplicação
docker-compose up

# Execute as migrações do banco de dados
knex migrate:latest

# Instale as dependências da aplicação
npm install

# Inicie o bot em modo de desenvolvimento
npm run dev
```
