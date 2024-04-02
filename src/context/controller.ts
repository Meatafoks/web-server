import { ExpressController } from '../exp'
import { Middleware } from '@decorators/express/lib/src/middleware'
import { RawService } from 'metafoks-application'
import { MetafoksWebControllerIdentifier } from './id'

export function Controller(url: string, middleware?: Middleware[]): ClassDecorator {
  return target => {
    RawService({ id: MetafoksWebControllerIdentifier.toString(), multiple: true })(target)
    ExpressController(url, middleware)(target)
  }
}
