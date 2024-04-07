import { Application, Configure, With } from 'metafoks-application'
import { WebServer } from '../src'

@With(
  WebServer.extension.configure({
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
