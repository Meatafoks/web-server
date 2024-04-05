import { Container, MetafoksExtension } from 'metafoks-application'
import { MetafoksWebServer } from '../MetafoksWebServer'
import { MetafoksWebServerConfig } from '../config'
import { controllerImporter } from '../context'
import { merge } from '@metafoks/toolbox'

export const MetafoksWebServerExtension = (
  baseConfig: Partial<MetafoksWebServerConfig> = {},
): MetafoksExtension<{ server: MetafoksWebServerConfig }> => {
  return {
    identifier: 'com.metafoks.extension.WebServer',
    install: (container, config) => {
      const serverConfig = merge(baseConfig, config.server)
      container.set<MetafoksWebServer>(MetafoksWebServer, new MetafoksWebServer(serverConfig))
    },
    autorun: async (container, config) => {
      const serverConfig = merge(baseConfig, config.server)

      if (serverConfig.scanner?.enabled !== false) {
        const defaultControllersGlob = 'src/**/*.ts'
        await controllerImporter(serverConfig.scanner?.controllersGlob ?? defaultControllersGlob)
      }
      await container.get(MetafoksWebServer).start()
    },
  }
}
