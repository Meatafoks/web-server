import { CorsOptions } from 'cors'
import { LoggerLevelValue } from 'metafoks-application'

export interface MetafoksWebServerConfig {
  port?: number
  host?: string
  cors?: CorsOptions

  useBodyParser?: boolean
  useCors?: boolean
  useErrorHandler?: boolean

  scanner?: {
    enabled?: boolean
    controllersGlob?: string
  }

  _loggerLevelInternal?: LoggerLevelValue
}
