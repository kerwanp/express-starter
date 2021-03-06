import * as express from 'express'

declare module 'express-serve-static-core' {
    interface Request extends express.Request {
        services: any,
        storage: any
    }
}

declare module 'express' {
    interface Request {
        services: any,
        storage: any
    }
}