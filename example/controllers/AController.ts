import { RestController, GetMapping, ResponseStatus, Query, Headers, Authorization } from '../../src'
import { Summary } from '../../src/openapi/decorators/path'
import { PostMapping } from '../../lib'

@RestController('/a')
export class AController {
  @Summary('test method')
  @GetMapping('/test')
  test(@Query('value1') value1: string, @Query('value2') value2: string, @Authorization headers: any) {
    console.log(headers)
    console.log(value1, value2)
    return { ok: 1 }
  }

  @Summary('test post method')
  @PostMapping('/test')
  testPost(@Query('value1') value1: string, @Query('value2') value2: string, @Authorization headers: any) {
    console.log(headers)
    console.log(value1, value2)
    return { ok: 1 }
  }

  @GetMapping('/err')
  @ResponseStatus(201)
  errTest() {
    throw new Error('test error')
    return { ok: 2 }
  }
}
