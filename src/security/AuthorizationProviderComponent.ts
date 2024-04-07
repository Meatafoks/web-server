import { RawService } from 'metafoks-application'

export const AuthorizationProviderComponentIdentifier = Symbol('AuthProviderComponent').toString()

export const AuthorizationProviderComponent = RawService(AuthorizationProviderComponentIdentifier)
