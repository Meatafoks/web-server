import { RestController } from '../../src'
import { Authorized, GetMapping } from '../../lib'
import { Security, Summary } from '../../src/openapi/decorators/path'

@RestController('/test')
export class TestController {
  @Security()
  @Summary('Возвращает приватные данные')
  @Authorized()
  @GetMapping('/private-data')
  public getPrivateData() {
    return { ok: true }
  }
}
