import { getMeta, Middleware, RestControllerClass, RestControllerMeta } from '../_core'
import { RouterOptions } from 'express'
import { RawService } from 'metafoks-application'
import { MetafoksWebControllerIdentifier } from './id'

export class WebServerContext {
  public static registerController(
    url: string,
    middlewareOrRouterOptions?: Middleware[] | RouterOptions,
    middleware: Middleware[] = [],
  ) {
    return (target: any) => {
      const meta: RestControllerMeta = getMeta(target.prototype as RestControllerClass)

      meta.url = url
      meta.middleware = Array.isArray(middlewareOrRouterOptions) ? middlewareOrRouterOptions : middleware
      meta.routerOptions = Array.isArray(middlewareOrRouterOptions) ? null : (middlewareOrRouterOptions as any)

      RawService({ id: MetafoksWebControllerIdentifier.toString(), multiple: true })(target)
    }
  }
}
