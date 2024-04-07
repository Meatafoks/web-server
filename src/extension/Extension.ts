import { MetafoksExtension } from 'metafoks-application'
import { WebServer } from '../WebServer'
import { WebServerConfig } from '../config'
import { controllerImporter } from '../context'

export const extension: MetafoksExtension<WebServerConfig> = {
  configProperty: 'server',
  identifier: 'com.metafoks.extension.WebServer',
  install: (container, config) => {
    container.set<WebServer>(WebServer, new WebServer(config))
  },
  autorun: async (container, config) => {
    if (config.scanner?.enabled !== false) {
      const defaultControllersGlob = 'src/**/*.ts'
      await controllerImporter(config.scanner?.controllersGlob ?? defaultControllersGlob)
    }
    await container.get(WebServer).start()
  },
  close: async (_, container) => {
    const ws = container.get(WebServer)
    await ws.stop()
  },
}
