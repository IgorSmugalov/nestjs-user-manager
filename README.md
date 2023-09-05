<h1 align="center"> User Manager App</h1>
<p align="center">Backend PetProject</p>
<p align="center">[WIP]</p>

# Stack

- **Platform**: NodeJs, TypeScript
- **Framework**: NestJs
- **Protocol**: REST
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Run**: Docker & Docker-compose

# Description and features

## **Сore functionality**

User and Profile Models with basic CRUD operations:

- User instance used for storing auth and private data: credentials, roles, activation status, keys and other
- Profile instance used for storing public data: name, surname, avatar and other
- CRUD operations over instances:
  - Registration with creating unactivated User and Profile instances
  - User activation by email and key with key lifetime limitations and renew key functionality
  - User or Profile updating
  - Getters for User or Profile
  - Avatar uploading
  - Updatind password with old password validation
  - Restoring password by email and key
  - [WIP] Blocking and deleting User

## **Authentication**

Without PassportJS or any other ready to use solution:
only for signing tokens and generating asymmetric keys sets used Jose, any other functionality self iplemented

- Authentication by two JWT tokens
  - Access JWT for access to all not public endpoints
  - Refresh JWT for renewing access token
- Signing and Verifying JWT by JSON Web Keys Sets
  - Service for generating, storing or reading two sets of keys
  - Any set has public and private key (used ssymmetric keys: RS256 for Access JWT and RS512 for Refresh JWT)
- Verification of Refresh Token additional based on whitelist:
  - Whitelist store unique JWT IDs, user can has only 5 Refresh Tokens
  - Any key must be used only once
- Sending refresh token to client by HTTP Only Cookie
- Middlewares for Authentication and attaching Authenticated User data from token to Request
- Guards for access control

## **Authorization**

More flexible and integrated approach, than suggested by the Nest documentation:
Used CASL, dynamic module and factory approach for creating and checking permissions by user roles

- Permissions defined separately for each module
- In separate module permissions defined in one place with short and readable form
- Access must be controlled by:
  - Role
  - Condition (e.g. user is owner of resource)
  - Permitted fields of resourse (Different roles can have full or partial access to modify resource)
  - Combination of the above
- Сonfigurable Guard (by decorator and metadata) for every protected endpoint

## Addtitional used

- Event Emitter for sending email
- JSDoc
- Swagger

## Todo

- Complete documentation and swagger
- Add user blocking and deletion
- Update imports for modules

# Usage

- Clone this repository
- Run:

```bash
$ npm i
$ docker-compose up -d
$ npm run start:dev
$ npx prisma generate
```

- Container includes dev SMTP server, all mails can be viewed on [http://localhost:3001](http://localhost:3001)

# Access

- **API**: [http://localhost:3000](http://localhost:3000)

- **Doc**: [http://localhost:3000/api](http://localhost:3000/api)

- **Emails**: [http://localhost:3001](http://localhost:3001)

# Requirements:

- Node
- docker
- docker-compose

# Default Settings

- Postgres:

  - `localhost:5432`
  - **Username:** postgres
  - **Password:** password

- SMTP:

  - `localhost:25`
  - **Username:** user
  - **Password:** password

- PgAdmin:
  - **URL:** [http://localhost:5433](http://localhost:5433)
  - **Username:** admin@localhost.com
  - **Password:** root

# Environments

This app contains environment variables, stored in `.env`

<!--
## Postgres ENV

- `POSTGRES_DB` default value: **database**
- `POSTGRES_USER` default value: **postgres**
- `POSTGRES_PASSWORD` default value: **password**

## PgAdmin ENV

- `PGADMIN_DEFAULT_EMAIL` default value: **admin@localhost.com**
- `PGADMIN_DEFAULT_PASSWORD` default value: **root** -->
