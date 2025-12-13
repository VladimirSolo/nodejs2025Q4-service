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
PORT=4000

DATABASE_URL=postgresql://postgres:postgres@localhost:5432/music_db?schema=public
NODE_ENV=production

LOG_LEVEL=log
LOG_FILE_MAX_SIZE=1024

JWT_ACCESS_SECRET=a7f8d9e3b2c1a5f6e4d8c9b7a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4
JWT_REFRESH_SECRET=f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d
```

## Running application

```
npm start
```

All

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/.
For more information about OpenAPI/Swagger please visit https://swagger.io/.

## Logs are recorded in

```
logs/app.log
```

## Testing

To run all test with authorization

```
npm run test:auth
```

To run only specific test suite with authorization

```
npm run test:auth -- <path to suite>
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
