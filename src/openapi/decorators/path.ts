import { getOpenApiMeta } from '../meta'

function basicDecoratorFactory(key: string, value: any): MethodDecorator {
  return (target: any, method: string | symbol, descriptor: any) => {
    const meta = getOpenApiMeta(target)
    const methodMeta: any = (meta[method.toString()] = meta[method.toString()] || {})
    methodMeta[key] = value
    return descriptor
  }
}

export function Summary(summary: string): MethodDecorator {
  return basicDecoratorFactory('summary', summary)
}

export function Security(schemeName: string = 'bearerAuth', scopes?: string[]): MethodDecorator {
  return (target: any, method: string | symbol, descriptor: any) => {
    const meta = getOpenApiMeta(target)
    const methodMeta = (meta[method.toString()] = meta[method.toString()] || {})
    const security = (methodMeta.security = methodMeta.security || [])
    security.push({
      [schemeName]: scopes || [],
    })
    return descriptor
  }
}
