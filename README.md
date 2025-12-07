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

## Running docker

# development start for hot reload

```
docker-compose -f docker-compose.dev.yml up
```

# development down

```
docker-compose -f docker-compose.dev.yml down

```

# production start

```
docker-compose up --build

```

# production down

```
docker-compose down -v
```

Application is running on: http://localhost:3000
API Documentation available at: http://localhost:3000/doc
