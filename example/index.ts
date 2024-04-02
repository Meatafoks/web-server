import { Application, Configure, With } from 'metafoks-application'
import { MetafoksWebServerExtension } from '../src'

import './AController'
import './BController'

@With(MetafoksWebServerExtension)
@Configure({ configReader: { configsPath: 'example/config' } })
@Application
export class App {}
