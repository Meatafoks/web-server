import { Application, Autowire, MetafoksApplication, With } from 'metafoks-application'
import './AController'
import './BController'
import { MetafoksWebServer, MetafoksWebServerExtension } from '../src'

MetafoksApplication.shared.configReader.configure({ configsPath: 'example/config' })

@With(MetafoksWebServerExtension)
@Application
export class App {
  @Autowire
  public ws!: MetafoksWebServer

  public async start() {
    await this.ws.start()
  }
}
