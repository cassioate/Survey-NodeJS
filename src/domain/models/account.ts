import { Roles } from './roles'

export interface AccountModel {
  id: string
  name: string
  email: string
  password: string
  role?: Roles
}

export interface AddAccountParams {
  name: string
  email: string
  password: string
}
