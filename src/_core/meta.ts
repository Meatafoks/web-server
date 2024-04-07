import { RouterOptions } from 'express'

import { Middleware } from './middleware'

export enum ParameterType {
  REQUEST,
  RESPONSE,
  PARAMS,
  QUERY,
  BODY,
  HEADERS,
  COOKIES,
  NEXT,
  AUTHORIZATION,
}

export interface MethodParameterConfiguration {
  index: number
  type: ParameterType
  name?: string
  data?: any
}

export interface RestRoute {
  method: string
  url: string
  middleware: Middleware[]
}

export interface MethodMeta {
  routes: RestRoute[]
  status?: number
}

export interface RestControllerMeta {
  url: string

  routerOptions?: RouterOptions

  routes: {
    [instanceMethodName: string]: MethodMeta
  }

  middleware: Middleware[]

  params: {
    [key: string]: MethodParameterConfiguration[]
  }
}

export interface RestControllerClass {
  __rest_controller_meta__?: RestControllerMeta
}

export function getMeta(target: RestControllerClass): RestControllerMeta {
  if (!target.__rest_controller_meta__) {
    target.__rest_controller_meta__ = {
      url: '',
      middleware: [],
      routes: {},
      params: {},
    }
  }
  return target.__rest_controller_meta__
}
