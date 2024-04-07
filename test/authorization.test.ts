import { Authorization, Authorized, GetMapping, getRandomAvailablePort, WebServer, RestController } from '../src'

describe('test authorization', () => {
  const simpleMethodCall = jest.fn()

  let ws: WebServer
  let port: number

  @RestController('/simple')
  class SimpleController {
    @Authorized()
    @GetMapping('/method')
    async simpleMethod(@Authorization auth: string) {
      simpleMethodCall(auth)
      return { message: 'ok' }
    }
    @Authorized({
      testAuthorization(token?: string): Promise<boolean> {
        if (token === 'Bearer token') return Promise.resolve(true)
        return Promise.resolve(false)
      },
    })
    @GetMapping('/method-custom-provider')
    async simpleMethodWithCustomProvider(@Authorization auth: string) {
      simpleMethodCall(auth)
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

  beforeEach(() => {
    simpleMethodCall.mockClear()
  })

  it('should call simple method', async () => {
    // when
    // test request to simple controller
    await fetch(`http://localhost:${port}/simple/method`, {
      headers: {
        Authorization: 'Bearer token',
      },
    })

    // then
    expect(simpleMethodCall).toBeCalledWith('Bearer token')
  })

  it('should call simple method without auth', async () => {
    // when
    // test request to simple controller
    const resp = await fetch(`http://localhost:${port}/simple/method`, {
      headers: {},
    })

    // then
    expect(resp.status).toBe(401)
    expect(simpleMethodCall).not.toHaveBeenCalled()
  })

  it('should call simple method with custom provider', async () => {
    // when
    // test request to simple controller
    await fetch(`http://localhost:${port}/simple/method-custom-provider`, {
      headers: {
        Authorization: 'Bearer token',
      },
    })

    // then
    expect(simpleMethodCall).toBeCalledWith('Bearer token')
  })

  it('should call simple method with custom provider and invalid token', async () => {
    // when
    // test request to simple controller
    const resp = await fetch(`http://localhost:${port}/simple/method-custom-provider`, {
      headers: {
        Authorization: 'Bearer invalid',
      },
    })

    // then
    expect(resp.status).toBe(401)
    expect(simpleMethodCall).not.toHaveBeenCalled()
  })
})
