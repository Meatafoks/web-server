import { Application, Configure, With } from 'metafoks-application'
import { MetafoksWebServerExtension } from '../src'

@With(MetafoksWebServerExtension())
@Configure({
  configReader: {
    configsPath: 'example/config',
    defaultConfig: {
      server: {
        scanner: {
          controllersGlob: 'example/*/**.ts',
        },
      },
    },
  },
})
@Application
export class App {}
