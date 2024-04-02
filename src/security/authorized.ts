import { createMiddleware } from '../exp'
import { Request, Response } from 'express'

export function Authorized() {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    createMiddleware(target, propertyKey, (req: Request, res: Response, next: any) => {
      if (req.headers['authorization']) {
        next()
      } else {
        res.status(401).send({ error: 'Unauthorized', message: '' })
      }
    })
  }
}
