import { Request, Response, NextFunction, RequestHandler, ErrorRequestHandler } from 'express'

import { Type } from './types'
import { Container } from 'metafoks-application'
import { getMeta, RestControllerClass, RestControllerMeta } from './meta'

export type MiddlewareFunction = (req: Request, res: Response, next: NextFunction) => void
export interface MiddlewareClass {
  use: MiddlewareFunction
}
export type Middleware = MiddlewareFunction | Type<MiddlewareClass>

export type ErrorMiddlewareFunction = (error: Error, request: Request, response: Response, next: NextFunction) => void
export interface ErrorMiddlewareClass {
  use: ErrorMiddlewareFunction
}
export type ErrorMiddleware = ErrorMiddlewareFunction | Type<ErrorMiddlewareClass>

/**
 * Create request middleware handler that uses class or function provided as middleware
 */
export function middlewareHandler(middleware: Middleware): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    invokeMiddleware(middleware, [req, res, next]).catch(next)
  }
}

/**
 * Add error middleware to the app
 */
export function errorMiddlewareHandler(): ErrorRequestHandler {
  return (error: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(error)
    res.status(500).send({ error: error.name ?? 'Internal Server Error', message: error.message })
    next()

    // invokeMiddleware(ERROR_MIDDLEWARE, [error, req, res, next]).catch(next)
  }
}

/**
 * Instantiate middleware and invoke it with arguments
 */
async function invokeMiddleware(
  middleware: any | Middleware | ErrorMiddleware,
  args: Parameters<MiddlewareFunction> | Parameters<ErrorMiddlewareFunction>,
) {
  const next = args[args.length - 1] as NextFunction

  try {
    const instance = await getMiddlewareInstance(middleware)

    if (!instance) {
      return next()
    }

    const handler = (instance as MiddlewareClass | ErrorMiddlewareClass)?.use ?? instance
    // @ts-ignore
    const result = typeof handler === 'function' ? handler.apply(instance, args) : instance

    if (result instanceof Promise) {
      result.catch(next)
    }
  } catch (err) {
    next(err)
  }
}

async function getMiddlewareInstance(middleware: any | Middleware | ErrorMiddleware) {
  try {
    if (!Container.has(middleware) && (middleware as Type).prototype?.use) {
      Container.set(middleware, middleware as Type)
    }

    return await Container.get(middleware)
  } catch (e) {
    if (typeof middleware === 'function') {
      return middleware.prototype?.use ? new (middleware as Type<MiddlewareClass | ErrorMiddlewareClass>)() : middleware
    }

    return null
  }
}

export function createMiddleware(target: any, property: string, middleware: MiddlewareFunction) {
  const meta: RestControllerMeta = getMeta(target as RestControllerClass)
  if (meta.url !== '') {
    meta.middleware.unshift(middleware)
  } else if (property in meta.routes) {
    meta.routes[property].routes[0].middleware.unshift(middleware)
  }
}
