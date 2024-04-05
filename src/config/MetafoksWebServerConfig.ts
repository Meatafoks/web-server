import { CorsOptions } from 'cors'

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
}
