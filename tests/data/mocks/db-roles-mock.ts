import { LoadRolesRepository } from '../../../src/data/protocols/db/db-roles/load-roles-repository'
import { Roles } from '../../../src/domain/models/roles'

export const makeLoadRolesRepositoryStub = (): LoadRolesRepository => {
  class LoadRolesRepositoryStub implements LoadRolesRepository {
    async loadRole (role: string): Promise<Roles> {
      return {
        id: 1,
        value: 'admin'
      }
    }
  }
  return new LoadRolesRepositoryStub()
}
