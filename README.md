# Task Management

This is a service to manage tasks

## Description

A task has the following attributes:

| Field name  |        Description         |                    Rules                    |
| :---------: | :------------------------: | :-----------------------------------------: |
|    title    |        Name of task        |                  required                   |
| description | Explanation about the task |                  required                   |
|   status    | Current status of the task | required,<br/>in: OPEN, IN_PROGRESS or DONE |

## Technologies

- [NestJS](http://nestjs.com)
- [JavaScript Standard Style](https://github.com/standard/standard)
- [ESLint](https://eslint.org) and [Prettier](https://prettier.io)
- [Husky](https://github.com/typicode/husky)

## Requirements

### For local usage:

- [Node.js](https://nodejs.org) (v14)
- [npm](https://www.npmjs.com)
- [Postgres](https://www.postgresql.org) (v13)

### For local usage with Docker:

- [Docker Engine](https://docs.docker.com/install)
- [Docker Compose](https://docs.docker.com/compose/install)

## Running

### With Docker

```bash
docker-compose up
```

#### URLs:

- Base URL for API: [http://10.12.0.2:3000](http://10.12.0.2:3000)
- PGAdmin: [http://10.12.0.4](http://10.12.0.4) - Login as **user@domain.com**, pass **123456**

#### Application container

```bash
docker exec -it nestjs-tasks bash
```

### Without Docker

```bash
$ npm install

# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Usage

Consult the [project documentation](https://taskmanagement7.docs.apiary.io/)

### TL;DR

1. Open Postman
2. Import [this collection](docs/NestJS%20Task%20Management.postman_collection.json)
3. Set the Postman Environments (use gear or eye buttons on top right):
   - key: taskManagementBaseURL value: http://10.12.0.2:3000 (as default)
   - key: taskManagementToken value: token (generate it from /auth/signin)