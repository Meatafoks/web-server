import { Request, Response } from 'express'
import { createMiddleware } from '../_core/middleware'
import { AuthorizationProvider } from './AuthorizationProvider'
import { Container } from 'metafoks-application'
import { AuthorizationProviderComponentIdentifier } from './AuthorizationProviderComponent'

export function Authorized(provider?: AuthorizationProvider) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    createMiddleware(target, propertyKey, (req: Request, res: Response, next: any) => {
      let activeProvider: AuthorizationProvider | undefined = provider

      if (!activeProvider && Container.has(AuthorizationProviderComponentIdentifier)) {
        activeProvider = Container.get(AuthorizationProviderComponentIdentifier)
      }

      if (activeProvider) {
        const token = req.headers['authorization']
        activeProvider
          .testAuthorization(token, req)
          .then(isAuthorized => {
            if (isAuthorized) {
              next()
            } else {
              res.status(401).send({ error: 'Unauthorized', message: '' })
            }
          })
          .catch(reason => next(reason))
      } else if (req.headers['authorization']) {
        next()
      } else {
        res.status(401).send({ error: 'Unauthorized', message: '' })
      }
    })
  }
}
