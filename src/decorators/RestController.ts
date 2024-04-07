import { RouterOptions } from 'express'

import { RestControllerClass, RestControllerMeta, getMeta } from '../_core/meta'
import { Middleware } from '../_core/middleware'
import { RawService } from 'metafoks-application'
import { MetafoksWebControllerIdentifier } from '../context'

/**
 * Registers controller for base url
 */
export function RestController(url: string, middleware?: Middleware[]): ClassDecorator
export function RestController(url: string, routerOptions?: RouterOptions, middleware?: Middleware[]): ClassDecorator
export function RestController(
  url: string,
  middlewareOrRouterOptions?: Middleware[] | RouterOptions,
  middleware: Middleware[] = [],
): ClassDecorator {
  return target => {
    const meta: RestControllerMeta = getMeta(target.prototype as RestControllerClass)

    meta.url = url
    meta.middleware = Array.isArray(middlewareOrRouterOptions) ? middlewareOrRouterOptions : middleware
    meta.routerOptions = Array.isArray(middlewareOrRouterOptions) ? null : (middlewareOrRouterOptions as any)

    RawService({ id: MetafoksWebControllerIdentifier.toString(), multiple: true })(target)
  }
}
