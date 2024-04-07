import {
  Authorization,
  AuthorizationProvider,
  AuthorizationProviderComponent,
  Authorized,
  GetMapping,
  getRandomAvailablePort,
  MetafoksWebServer,
  RestController,
} from '../src'

describe('test authorization provider', () => {
  const simpleMethodCall = jest.fn()

  let ws: MetafoksWebServer
  let port: number

  @AuthorizationProviderComponent
  class AuthProvider implements AuthorizationProvider {
    async testAuthorization(token?: string): Promise<boolean> {
      if (token === 'Bearer token') return Promise.resolve(true)
      return Promise.resolve(false)
    }
  }

  @RestController('/simple')
  class SimpleController {
    @Authorized()
    @GetMapping('/method-custom-provider')
    async simpleMethodWithCustomProvider(@Authorization auth: string) {
      simpleMethodCall(auth)
      return { message: 'ok' }
    }
  }

  beforeAll(async () => {
    port = await getRandomAvailablePort()
    ws = new MetafoksWebServer({
      port,
      scanner: { enabled: false },
      _loggerLevelInternal: 'debug',
    })
    await ws.start()
  })

  afterAll(async () => {
    await ws.stop()
  })

  beforeEach(() => {
    simpleMethodCall.mockClear()
  })

  it('should call simple method', async () => {
    // when
    // test request to simple controller
    const res = await fetch(`http://localhost:${port}/simple/method-custom-provider`, {
      headers: {
        Authorization: 'Bearer token',
      },
    })

    // then
    expect(res.status).toBe(200)
    expect(simpleMethodCall).toBeCalledWith('Bearer token')
  })

  it('should call simple method with failed authorization', async () => {
    // when
    // test request to simple controller
    const res = await fetch(`http://localhost:${port}/simple/method-custom-provider`, {
      headers: {
        Authorization: '123Bearer token2',
      },
    })

    // then
    expect(res.status).toBe(401)
    expect(simpleMethodCall).not.toBeCalled()
  })
})
