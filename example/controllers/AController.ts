import { Controller, Get, Res, Response, Status } from '../../src'

@Controller('/a')
export class AController {
  @Get('/test')
  test(@Res() res: Response) {
    res.send({ ok: 1 })
  }

  @Get('/err')
  @Status(201)
  errTest() {
    throw new Error('test error')
    return { ok: 2 }
  }
}
