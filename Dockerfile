FROM node:18-alpine

# RUN apt-get update
# RUN apt-get install -y openssl

WORKDIR /app

COPY  package*.json ./

RUN npm ci

COPY  . .

RUN npx prisma generate

