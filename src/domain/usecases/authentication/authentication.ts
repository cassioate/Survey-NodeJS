import { AuthenticationParams } from '../../models/account'

export interface Authentication {
  auth: (authentication: AuthenticationParams) => Promise<string>
}
