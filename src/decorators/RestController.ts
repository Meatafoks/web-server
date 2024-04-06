import { RouterOptions } from 'express'
import { Injectable } from '@decorators/di'

import { Type } from '../decoratorsexpress/types'
import { ExpressClass, ExpressMeta, getMeta } from '../decoratorsexpress/meta'
import { Middleware } from '../decoratorsexpress/middleware'
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
) {
  return (target: Type) => {
    const meta: ExpressMeta = getMeta(target.prototype as ExpressClass)

    meta.url = url
    meta.middleware = Array.isArray(middlewareOrRouterOptions) ? middlewareOrRouterOptions : middleware
    meta.routerOptions = Array.isArray(middlewareOrRouterOptions) ? null : (middlewareOrRouterOptions as any)

    RawService({ id: MetafoksWebControllerIdentifier.toString(), multiple: true })(target)
    Injectable()(target)
  }
}
