import { Container, MetafoksExtension } from 'metafoks-application'
import { MetafoksWebServer } from '../MetafoksWebServer'
import { MetafoksWebServerConfig } from '../config'

export const MetafoksWebServerExtension: MetafoksExtension<{ server: MetafoksWebServerConfig }> = {
  identifier: 'com.metafoks.extension.WebServer',
  install: (container, config) => {
    container.set<MetafoksWebServer>(MetafoksWebServer, new MetafoksWebServer(config.server))
  },
  autorun: async container => {
    await container.get(MetafoksWebServer).start()
  },
}
