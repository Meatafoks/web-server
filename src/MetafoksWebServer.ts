import express, { Express } from 'express'
import { MetafoksWebServerConfig } from './config'
import { Container, LoggerFactory } from 'metafoks-application'
import bodyParser from 'body-parser'
import cors from 'cors'
import { MetafoksWebControllerIdentifier } from './context'
import * as http from 'http'
import { connectRestControllersToExpress, RestControllerClass } from './_core'

export class MetafoksWebServer {
  public static patchers: Array<(...args: any[]) => void> = []
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
    this._instance = express()
    if (config._loggerLevelInternal) {
      this._logger.level = config._loggerLevelInternal
    }

    if (this.config.useCors !== false) this._instance.use(cors(this.config.cors))
    if (this.config.useBodyParser !== false) this._instance.use(bodyParser.json())
  }

  /**
   * Завершает работу сервера
   */
  public async stop(): Promise<void> {
    return new Promise((resolve, reject) => {
      this._server?.close(err => {
        if (err) {
          this._logger.warn(`error while stopping server: ${err.message}`)
          reject(err)
          return
        }
        this._logger.info('web server has been stopped')
        resolve()
      })
    })
  }

  public async start() {
    // Логирование запросов
    this._instance.use((req, res, next) => {
      const sp = new URLSearchParams(Object.keys(req.query).reduce((acc, v) => ({ ...acc, [v]: req.query[v] }), {}))
      const query = sp.toString().length > 0 ? `?${sp.toString()}` : ''
      this._logger.info([req.method, req.path + query].filter(value => !!value).join(' '))
      next()
    })

    const controllers = Container.getMany<RestControllerClass>(MetafoksWebControllerIdentifier.toString())
    for (const ctr of controllers) {
      this._logger.debug(`registering controller: ${ctr.__rest_controller_meta__!.url}`)
    }

    await connectRestControllersToExpress(this._instance, controllers ?? [])
    await this.modifier?.(this._instance)

    // Запуск патчеров
    MetafoksWebServer.patchers.forEach(fn => this._instance.use(fn))

    this._logger.debug('starting web server')
    if (this.config.host) {
      this._server = this._instance.listen(this.config.port ?? 8085, this.config.host, () => {
        this._logger.info(`web server started on <${this.config.host}:${this.config.port}>`)
      })
    } else {
      this._server = this._instance.listen(this.config.port ?? 8085, () => {
        this._logger.info(`web server started on port <:${this.config.port ?? 8085}>`)
      })
    }
  }
}
