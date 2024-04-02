import { Get, Res, Response, Controller, Status } from '../src'

@Controller('/b')
export class BController {
  @Get('/test')
  test(@Res() res: Response) {
    res.send({ ok: 2 })
  }

  @Get('/ret')
  @Status(401)
  async ret() {
    return { ok: 812 }
  }
}
