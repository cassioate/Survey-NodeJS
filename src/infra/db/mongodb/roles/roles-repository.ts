import { LoadRolesRepository } from '../../../../data/protocols/db/roles/load-roles-repository'
import { Roles } from '../../../../domain/models/roles'
import { MongoHelper } from '../helpers/mongo-helper'

export class RoleMongoRepository implements LoadRolesRepository {
  async loadRole (role: string): Promise<Roles> {
    const rolesCollection = await MongoHelper.getCollection('roles')
    const roleValue = await rolesCollection.findOne({ value: role })
    return roleValue && MongoHelper.map(roleValue)
  }
}
