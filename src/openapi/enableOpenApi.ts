import { Express } from 'express'
import * as swaggerUi from 'swagger-ui-express'
import { OpenApiClass, OpenApiOptions, SchemaDef } from './types'
import { Container } from 'metafoks-application'
import { RestControllerClass } from '../_core/meta'

export const OPENAPI_DOCUMENT = 'openapi_doc'
export function getOpenApiDoc() {
  if (Container.has(OPENAPI_DOCUMENT)) {
    return Container.get(OPENAPI_DOCUMENT)
  }
  const doc: any = {
    openapi: '3.0.3',
    tags: [],
    paths: {},
    security: [],
    components: {},
  }

  Container.set(OPENAPI_DOCUMENT, doc)
  return doc
}

export function enableOpenApi(app: Express, options: OpenApiOptions = {}, controllers: RestControllerClass[]) {
  const doc = getOpenApiDoc()

  // add the basics
  Object.assign(doc, {
    info: {
      title: options.info?.title || process.env.npm_package_name,
      description: options.info?.description || process.env.npm_package_description,
      version: options.info?.version || process.env.npm_package_version,
    },
    tags: options.tags,
    servers: options.servers,
    externalDocs: options.externalDocs,
    security: options.security,
  })

  Object.assign(doc.components, {
    securitySchemes: options.components?.securitySchemes,
  })

  // setup swagger UI
  const serveOnPath = options.serveOnPath || '/swagger'

  let paths: Record<string, any> = {}
  controllers.forEach((controller: RestControllerClass & OpenApiClass) => {
    const meta = controller.__rest_controller_meta__
    const openApiMeta = controller.__openapi_meta__ ?? {}
    const name = controller.constructor.name

    if (meta) {
      const baseUrl = meta.url
      for (const [methodName, methodMeta] of Object.entries(meta.routes)) {
        methodMeta.routes.forEach(route => {
          const path = baseUrl + route.url
          paths[path] = paths[path] || {}
          paths[path][route.method] = {
            tags: [name],
            summary: openApiMeta[methodName]?.summary,
            security: openApiMeta[methodName]?.security,
            // description: meta.name + '.' + methodName,
            responses: {
              '200': {
                description: 'OK',
              },
            },
          }
        })
      }
    }
  })

  app.use(
    serveOnPath,
    swaggerUi.serve,
    swaggerUi.setup({
      ...doc,
      paths,
    }),
  )
}

export async function registerSchema(name: string, schema: SchemaDef): Promise<void> {
  const doc = await getOpenApiDoc()
  const schemas = (doc.components.schemas = doc.components.schemas || {})

  schemas[name] = schema
}
