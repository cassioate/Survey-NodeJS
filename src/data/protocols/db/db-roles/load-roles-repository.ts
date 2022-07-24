import { Roles } from '../../../../domain/models/roles'

export interface LoadRolesRepository {
  loadRole: (role: string) => Promise<Roles>
}
