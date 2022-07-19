import { Roles } from './roles'

export interface AccountModel {
  id: string
  name: string
  email: string
  password: string
  role?: Roles
}
