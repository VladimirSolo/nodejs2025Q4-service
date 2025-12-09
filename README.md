# Home Library Service 2

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Downloading

```
git clone {repository URL}
```

## Installing NPM modules

```
npm install
```

## add .env

```
DATABASE_URL="postgresql://postgres:postgres@postgres:5432/music_db?schema=public"
NODE_ENV=production
```

# 1. Running only PostgreSQL

```
docker-compose up -d postgres
```

# 2. Create migrate - copy and paste in CLI

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/music_db?schema=public" npx prisma migrate dev --name init
```

# 4. Stop PostgreSQL

```
docker-compose down
```

## Running docker

# production start

```
docker-compose up --build

```

# production down

```
docker-compose down -v
```

# development start for hot reload

```
docker-compose -f docker-compose.dev.yml up
```

# development down

```
docker-compose -f docker-compose.dev.yml down

```

Application is running on: http://localhost:3000
API Documentation available at: http://localhost:3000/doc
