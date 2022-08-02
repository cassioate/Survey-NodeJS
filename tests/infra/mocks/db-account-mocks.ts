import { Collection } from 'mongodb'

export const makeFakeAccountInDB = async (accountCollection: Collection, email: string): Promise<string> => {
  const result = await accountCollection.insertOne({
    name: 'cassio',
    email: 'email',
    password: '123456'
  })
  return result.insertedId.toHexString()
}
