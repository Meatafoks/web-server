import { Application, Configure, With } from 'metafoks-application'
import { MetafoksWebServerExtension } from '../src'

@With(
  MetafoksWebServerExtension({
    scanner: {
      controllersGlob: 'example/*/**.ts',
    },
  }),
)
@Configure({
  config: {
    configPath: 'example/config',
  },
})
@Application
export class App {}
