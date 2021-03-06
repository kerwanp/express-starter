<div align="center">
    <h1>
        Express Starter
    </h1>
    <a href="https://github.com/kerwanp/express-starter/actions">
        <img alt="CI Badge" src="https://img.shields.io/github/workflow/status/kerwanp/express-starter/CI?style=for-the-badge">
    </a>
    <a href="https://github.com/kerwanp/express-starter/blob/master/LICENSE" title="dependencies status">
        <img src="https://img.shields.io/github/license/kerwanp/express-starter?style=for-the-badge"/>
    </a>
    <a href="https://david-dm.org/kerwanp/express-starter">
        <img src="https://img.shields.io/david/kerwanp/express-starter?style=for-the-badge">
    </a>
    <a href="https://david-dm.org/kerwanp/express-starter?type=dev">
        <img src="https://img.shields.io/david/dev/kerwanp/express-starter?style=for-the-badge">
    </a>
    <br/>
    <img src="https://img.shields.io/badge/made%20with-%E2%99%A5-red?style=for-the-badge">
    <br/>
    <br/>
    <h3>A simple application to begin an Express & Typescript project</h3>
</div>

## Setup

```shell script
$ git clone git@github.com:kerwanp/express-boilerplate.git && cd express-boilerplate
$ npm install
$ npm run serve
```

## Features

### Winston

Winston is a powerful logger for Javascript.

More informations https://github.com/winstonjs/winston

Usage:
```typescript
app.logger.info(`Your message`)
```

### Express Winston

Express Winston provide a configurable Express middleware to log every requests.
You can find the configuration in the `src/middlewares/logger.middleware.ts` file.

More information: https://www.npmjs.com/package/express-winston

### Express Async Handler

Express does not handle Promise errors catching. You can use express-async-handler to handle errors sent from promise when using async/await.

Usage:
```typescript
import expressAsyncHandler = require("express-async-handler");

authRouter.get('/token', expressAsyncHandler(async (req, res) => {
    await req.services.authService.authenticate();
    res.send('Hello world')
}));
```

More information: https://www.npmjs.com/package/express-async-handler

### Dotenv
You can manage the configuration of your application by adding or editing the `src/.env` file. 
Then, simply use them as environment variables `process.env.DB_HOST`.

### File structure

#### Routers

Every routes are stored under the directory `src/routers` with the name `*.router.ts`.
This file should export the router which is used by the server in `src/routers/routers.ts`.

Example:
```typescript
// src/routers/users.router.ts
export const userRouter = express.Router();
userRouter.get('/hello', (req, res) => {
    res.send('Hello world')
});
```

```typescript
// src/routers/routers.Ts
export function loadRouters(server) {
    server.use('/users', userRouter)
}
```
> We have now the route `GET /users/hello`

#### Middleware

You can add your Middleware in the folder `src/middleware` with the name `*.middleware.ts`.
Next, use it in the file `src/middleware/middleware.ts`.

Example:
```typescript
// src/middleware/hello.middleware.ts
export function helloMiddleware(req, res, next) {
    console.log('HELLO WORLD !');
    next()
}
```
```typescript
// src/middleware/hello.middleware.ts
export function loadPostMiddleware(server: express.Express) {
    server.use(helloMiddleware)
}
```
> This will console 'HELLO WORLD' after using the routers.

#### Services

Services are stored in the folder `src/services` with the name `*.service.ts`.
They must be named `NameService` and they are stored in the request `req.services.name`
There is two types of services :

**Request services**

Every request, a new instance is created. You can store data and use the Request and the Response inside of it.

Example:
```typescript
// src/services/auth.service.ts
export class AuthService {
  private token;
  constructor(request: Request, response: Response) {
    // As there is one instance by Request
    // you can store data and use the request (& response)
    // in your service.
    this.token = request.headers['X-Authorization']
  }
  
  async authenticate() { }
}
```

```typescript
// src/services/services.ts
export const services = [
  AuthService
]
```

> By default, a service is a **request service**

**Response Services**

Sometime, you will need services which needs to be singleton and have only on instance of it.

Example:
```typescript
// src/services/discord.service.ts
@RuntimeService()
export class DiscordService {
  private client;
  constructor() {
    this.client = new Discord.Client()
    this.client.login()
  }
  
  getUserData() { }
}
```

```typescript
export const services = [
  AuthService,
  DiscordService
]
```


You can now use theses services inside your routes:
```typescript
 authRouter.get('/users/me', (req, res) => {
   await req.services.auth.authenticate()
   return res.send(
     req.services.discord.getUserData()
   )
 })
```
