import {
  Body,
  GetMapping,
  MetafoksWebServer,
  Params,
  PostMapping,
  Query,
  RestController,
  Headers,
  getRandomAvailablePort,
} from '../src'

describe('test params', () => {
  const simpleMethodCall = jest.fn()
  const simpleMethodCallWithBody = jest.fn()
  const simpleMethodCallWithHeaders = jest.fn()

  let port: number
  let ws: MetafoksWebServer

  @RestController('/simple')
  class SimpleController {
    @GetMapping('/method/:testPath')
    async simpleMethod(
      @Query('test') test: string,
      @Query('test2') test2: string,
      @Params('testPath') testPath: string,
    ) {
      simpleMethodCall(testPath, test, test2)
      return { message: 'ok' }
    }

    @PostMapping('/method')
    async simpleMethodWithBody(@Body() body: { key: string }) {
      simpleMethodCallWithBody(body)
      return { message: 'ok' }
    }

    @GetMapping('/headers-test')
    async simpleMethodWithHeaders(@Headers('test') test: string) {
      simpleMethodCallWithHeaders(test)
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
    jest.clearAllMocks()
  })

  it('should call simple method with parameters', async () => {
    // when
    // test request to simple controller
    await fetch(`http://localhost:${port}/simple/method/123?test=test&test2=test2`)

    // then
    expect(simpleMethodCall).toBeCalledWith('123', 'test', 'test2')
  })

  it('should call simple method with body', async () => {
    // when
    // test request to simple controller
    await fetch(`http://localhost:${port}/simple/method`, {
      method: 'POST',
      body: JSON.stringify({ key: 'value' }),
      headers: { 'Content-Type': 'application/json' },
    })

    // then
    expect(simpleMethodCallWithBody).toBeCalledWith({ key: 'value' })
  })

  it('should call simple method with headers', async () => {
    // when
    // test request to simple controller
    await fetch(`http://localhost:${port}/simple/headers-test`, {
      headers: { test: 'value' },
    })

    // then
    expect(simpleMethodCallWithHeaders).toBeCalledWith('value')
  })
})
