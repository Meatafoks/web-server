import { GetMapping, RestController, ResponseStatus } from '../../src'

@RestController('/b')
export class BController {
  @GetMapping('/test')
  test() {
    return { ok: 2 }
  }

  @GetMapping('/ret')
  @ResponseStatus(401)
  async ret() {
    return { ok: 812 }
  }
}
