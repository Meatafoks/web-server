import {
  Middleware,
  Controller as ExpressController,
  Body,
  Params,
  Put,
  Patch,
  Post,
  Options,
  Get,
  Delete,
  All,
  Headers,
  Res,
  Req,
  Container,
  ErrorMiddleware,
  ERROR_MIDDLEWARE,
  Cookies,
  Next,
  Query,
  Status,
  attachMiddleware,
} from '@decorators/express'
import { Response, Request } from 'express'
import { Type } from '@decorators/express/lib/src/types'
import { MiddlewareFunction } from '@decorators/express/lib/src/middleware'

export type ControllerType = Type
export { MiddlewareFunction }
const WebServerContainer = Container
const createMiddleware = attachMiddleware

export {
  Middleware,
  ExpressController,
  Body,
  Params,
  Get,
  Post,
  Put,
  Patch,
  Options,
  Delete,
  All,
  Headers,
  Req,
  Res,
  Request,
  Response,
  WebServerContainer,
  ErrorMiddleware,
  ERROR_MIDDLEWARE,
  Cookies,
  Next,
  Query,
  Status,
  createMiddleware,
}
