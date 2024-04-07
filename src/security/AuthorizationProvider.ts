import { HttpRequest } from '../expressTypes'

export interface AuthorizationProvider {
  testAuthorization(token: string | undefined, request: HttpRequest): Promise<boolean>
}
