import { RequestHandler, Application, Router, Express, Request, Response, NextFunction } from 'express'

import { getMeta, ParameterType, RestControllerClass, MethodParameterConfiguration, RestControllerMeta } from './meta'
import { middlewareHandler, errorMiddlewareHandler } from './middleware'
import { ClassConstructor } from 'metafoks-application'

/**
 * Подключает контроллеры к экспрессу
 */
export async function connectRestControllersToExpress(
  app: Express | Router,
  controllers: InstanceType<ClassConstructor<any>>[],
) {
  const promises = controllers.map((controller: InstanceType<ClassConstructor<any>>[]) =>
    registerController(app, controller),
  )

  await Promise.all(promises)

  app.use(errorMiddlewareHandler())
}

async function registerController(app: Application | Router, Controller: InstanceType<ClassConstructor<any>>) {
  const controller = Controller
  const meta = getMeta(controller)
  const router = Router(meta.routerOptions)

  const routerMiddleware: RequestHandler[] = (meta.middleware || []).map(middleware => middlewareHandler(middleware))

  if (routerMiddleware.length) {
    router.use(...routerMiddleware)
  }

  for (const [methodName, methodMeta] of Object.entries(meta.routes)) {
    methodMeta.routes.forEach(route => {
      const routeMiddleware: RequestHandler[] = (route.middleware || []).map(middleware =>
        middlewareHandler(middleware),
      )
      const handler = routeHandler(controller, methodName, meta.params[methodName], methodMeta.status!)

      // @ts-ignore
      router[route.method].apply(router, [route.url, ...routeMiddleware, handler])
    })
  }

  ;(app as Router).use(meta.url, router)

  return app
}

function routeHandler(
  controller: RestControllerClass,
  methodName: string,
  params: MethodParameterConfiguration[],
  status: number,
) {
  return (req: Request, res: Response, next: NextFunction) => {
    const args = extractParameters(req, res, next, params)
    // @ts-ignore
    const result = controller[methodName].call(controller, ...args)

    if (result instanceof Promise) {
      result
        .then((r: any) => {
          if (!res.headersSent && typeof r !== 'undefined') {
            if (status) {
              res.status(status)
            }
            res.send(r)
          }
        })
        .catch(next)
    } else if (typeof result !== 'undefined') {
      if (!res.headersSent) {
        if (status) {
          res.status(status)
        }
        res.send(result)
      }
    }

    return result
  }
}

function extractParameters(
  req: Request,
  res: Response,
  next: NextFunction,
  params: MethodParameterConfiguration[] = [],
): any[] {
  const args = []

  for (const { name, index, type } of params) {
    switch (type) {
      case ParameterType.RESPONSE:
        args[index] = res
        break
      case ParameterType.REQUEST:
        args[index] = getParam(req, null, name)
        break
      case ParameterType.NEXT:
        args[index] = next
        break
      case ParameterType.PARAMS:
        args[index] = getParam(req, 'params', name)
        break
      case ParameterType.QUERY:
        args[index] = getParam(req, 'query', name)
        break
      case ParameterType.BODY:
        args[index] = getParam(req, 'body', name)
        break
      case ParameterType.HEADERS:
        args[index] = getParam(req, 'headers', name)
        break
      case ParameterType.AUTHORIZATION:
        args[index] = getParam(req, 'headers', 'authorization')
        break
      case ParameterType.COOKIES:
        args[index] = getParam(req, 'cookies', name)
        break
    }
  }

  return args
}

function getParam(source: any, paramType: any, name?: string): any {
  const param = source[paramType] || source

  return name ? param[name] : param
}
