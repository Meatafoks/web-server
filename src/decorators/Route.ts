import { ExpressMeta, getMeta, MethodMeta } from '../decoratorsexpress/meta'
import { Middleware } from '../decoratorsexpress/middleware'

/**
 * Route decorator factory, creates decorator
 */
function decoratorFactory(method: string, url: string, middleware: Middleware[] = []) {
  return (target: object, key: string, descriptor: any) => {
    const methodMetadata = getRouteMeta(target, key)

    methodMetadata.routes.push({ method, url, middleware })

    return descriptor
  }
}

/**
 * All routes
 *
 * Special-cased "all" method, applying the given route `path`,
 * middleware, and callback to _every_ HTTP method.
 */
export function AllMapping(url: string, middleware?: Middleware[]) {
  return decoratorFactory('all', url, middleware)
}

/**
 * Get route
 */
export function GetMapping(url: string, middleware?: Middleware[]) {
  return decoratorFactory('get', url, middleware)
}

/**
 * Post route
 */
export function PostMapping(url: string, middleware?: Middleware[]) {
  return decoratorFactory('post', url, middleware)
}

/**
 * Put route
 */
export function PutMapping(url: string, middleware?: Middleware[]) {
  return decoratorFactory('put', url, middleware)
}

/**
 * Delete route
 */
export function DeleteMapping(url: string, middleware?: Middleware[]) {
  return decoratorFactory('delete', url, middleware)
}

/**
 * Patch route
 */
export function PatchMapping(url: string, middleware?: Middleware[]) {
  return decoratorFactory('patch', url, middleware)
}

/**
 * Options route
 */
export function OptionsMapping(url: string, middleware?: Middleware[]) {
  return decoratorFactory('options', url, middleware)
}

/**
 * Head route
 *
 */
export function HeadMapping(url: string, middleware?: Middleware[]) {
  return decoratorFactory('head', url, middleware)
}

/**
 * Method status
 */
export function ResponseStatus(status: number) {
  return (target: object, key: string, descriptor: any) => {
    const methodMetadata = getRouteMeta(target, key)

    methodMetadata.status = status

    return descriptor
  }
}

function getRouteMeta(target: object, key: string): MethodMeta {
  const meta: ExpressMeta = getMeta(target)

  return (meta.routes[key] = meta.routes[key] || {
    routes: [],
  })
}
