import { Roles } from '../../../../src/domain/models/roles'

export const makeFakeUserRole = (): Roles => {
  return {
    id: 3,
    value: 'user'
  }
}

export const makeFakeAdminRole = (): Roles => {
  return {
    id: 1,
    value: 'admin'
  }
}
