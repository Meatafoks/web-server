import express, { Express } from 'express'
import { MetafoksWebServerConfig } from './config'
import { Container, LoggerFactory } from 'metafoks-application'
import { attachControllerInstances, ERROR_MIDDLEWARE } from '@decorators/express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { MetafoksWebControllerIdentifier } from './context'
import { ExpressMeta } from '@decorators/express/lib/src/meta'
import { WebServerContainer, Request, Response } from './exp'
import * as http from 'http'

export class MetafoksWebServer {
  private readonly _instance: Express
  private readonly _logger = LoggerFactory.create(MetafoksWebServer)

  private _server?: http.Server

  get instance(): Express {
    return this._instance
  }

  get server(): http.Server {
    return this._server!
  }

  constructor(
    private readonly config: MetafoksWebServerConfig,
    private readonly modifier?: (app: Express) => void | Promise<void>,
  ) {
    this._logger.level = 'DEBUG'
    this._instance = express()

    if (this.config.useCors !== false) this._instance.use(cors(this.config.cors))
    if (this.config.useBodyParser !== false) this._instance.use(bodyParser.json())
  }

  /**
   * Завершает работу сервера
   */
  public stop() {
    this._server?.close(() => {
      this._logger.info('web server has been stopped')
    })
  }

  public async start() {
    if (this.config.useErrorHandler !== false) {
      WebServerContainer.provide([
        {
          provide: ERROR_MIDDLEWARE,
          useValue: (error: Error, request: Request, response: Response) => {
            this._logger.error(error)
            response.status(500).send({ error: error.name ?? 'Internal Server Error', message: error.message })
          },
        },
      ])
    }

    const controllers = Container.getMany(MetafoksWebControllerIdentifier.toString())
    for (const ctr of controllers) {
      const target = ctr as { __express_meta__: ExpressMeta }
      this._logger.debug(`controller: ${target.__express_meta__.url}`)
    }

    await attachControllerInstances(this._instance, (controllers as any[]) ?? [])
    await this.modifier?.(this._instance)

    this._logger.debug('starting web server')
    if (this.config.host) {
      this._server = this._instance.listen(this.config.port ?? 8085, this.config.host, () => {
        this._logger.info(`web server started on: ${this.config.host}:$${this.config.port}`)
      })
    } else {
      this._server = this._instance.listen(this.config.port ?? 8085, () => {
        this._logger.info(`web server started on: ${this.config.host}:${this.config.port ?? 8085}`)
      })
    }
  }
}
