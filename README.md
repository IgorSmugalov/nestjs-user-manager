<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Description

[Nest](https://github.com/nestjs/nest) for development with Prisma, PostgreSQL, Docker And Hot Reload

# Usage

- Clone this repository
- Run:

```bash
$ docker-compose up -d
```

- If you add / update package in node-modules on host -> run next command for rebuild Docker and renew container volume '/app/node_modules':

```bash
$ docker-compose up -d --build --renew-anon-volumes
OR
$ docker-compose up -d --build --V
```

# Requirements:

- docker
- docker-compose

# Access

## Nest App

- **API**: [http://localhost:3000](http://localhost:3000)

## Swagger

- **Doc**: [http://localhost:3000/api](http://localhost:3000/api)

## Postgres:

- `postgres:5432`
- **Username:** postgres
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
