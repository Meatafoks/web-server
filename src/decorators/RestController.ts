import { RouterOptions } from 'express'

import { Middleware } from '../_core'
import { WebServerContext } from '../context/WebServerContext'

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
    WebServerContext.registerController(url, middlewareOrRouterOptions, middleware)(target)
  }
}
