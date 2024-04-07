import { GetMapping, getRandomAvailablePort, WebServer, RestController } from '../src'

describe('simple controllers test', () => {
  const simpleMethodCall = jest.fn()

  let ws: WebServer
  let port: number

  @RestController('/simple')
  class SimpleController {
    @GetMapping('/method')
    async simpleMethod() {
      simpleMethodCall()
      return { message: 'ok' }
    }
  }

  beforeAll(async () => {
    port = await getRandomAvailablePort()
    ws = new WebServer({
      port,
      scanner: { enabled: false },
      _loggerLevelInternal: 'debug',
    })
    await ws.start()
  })

  afterAll(async () => {
    await ws.stop()
  })

  it('should call simple method', async () => {
    // when
    // test request to simple controller
    await fetch(`http://localhost:${port}/simple/method`)

    // then
    expect(simpleMethodCall).toBeCalled()
  })
})
