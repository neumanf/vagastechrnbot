# Vagas Tech RN Bot

Realiza postagens de vagas na área tech situadas no estado do Rio Grande do Norte ou remotas, no canal [vagastechrn](https://t.me/s/vagastechrn).

## Requerimentos

- Node.js
- Npm
- Docker
- Knex CLI

## Desenvolvimento

Primeiramente, copie o arquivo `.env.example` para um arquivo chamado `.env` e mude as variáveis de ambiente de acordo com o arquivo exemplo. Em seguida:

```sh
# Suba os containers necessários para rodar a aplicação
docker-compose up

# Instale as dependências da aplicação
npm install

# Execute as migrações do banco de dados
npm run migration:migrate

# Inicie o bot em modo de desenvolvimento
npm run dev
```
