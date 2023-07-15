<h1 align="center"> User Manager</h1>
<p align="center">[WIP] PetProject</p>

# Stack

- **Platform**: TypeScript
- **Framework**: NestJs
- **Protocol**: REST
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth**: JWT & RBAC
- **Run**: Docker & Docker-compose
- **Other**: EventEmitter, Swagger, JsDoc, JWK, Jose, NodeMailer, FakeSMTP, Handlebars

# Usage

- Clone this repository
- Run:

```bash
$ npm i
$ docker-compose up -d
$ npm run start:dev
$ npx prisma generate
```

# Requirements:

- Node
- docker
- docker-compose

# Access

## Nest App

- **API**: [http://localhost:3000](http://localhost:3000)

## Swagger

- **Doc**: [http://localhost:3000/api](http://localhost:3000/api)

## Mails

- **Doc**: [http://localhost:3001](http://localhost:3001)

## Postgres:

- `localhost:5432`
- **Username:** postgres
- **Password:** password

## SMTP:

- `localhost:25`
- **Username:** user
- **Password:** password

## PgAdmin:

- **URL:** [http://localhost:5433](http://localhost:5433)
- **Username:** admin@localhost.com
- **Password:** root

# Environments

This Compose file contains environment variables, stored in `.env`

## Postgres ENV

- `POSTGRES_DB` default value: **database**
- `POSTGRES_USER` default value: **postgres**
- `POSTGRES_PASSWORD` default value: **password**

## PgAdmin ENV

- `PGADMIN_DEFAULT_EMAIL` default value: **admin@localhost.com**
- `PGADMIN_DEFAULT_PASSWORD` default value: **root**
