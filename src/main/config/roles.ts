import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'

export const setUpRoles = async (): Promise<void> => {
  try {
    const rolesCollection = await MongoHelper.getCollection('roles')
    await rolesCollection.deleteMany({})
    await rolesCollection.insertMany([
      { id: 1, value: 'admin' },
      { id: 2, value: 'sub-admin' },
      { id: 3, value: 'user' }
    ])
  } catch (error) {
    return null
  }
}
