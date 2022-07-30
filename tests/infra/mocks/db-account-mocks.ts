import { Collection } from 'mongodb'

export const makeFakeAccountInDB = async (accountCollection: Collection): Promise<string> => {
  const result = await accountCollection.insertOne({
    name: 'cassio',
    email: 'cassio@gmail.com',
    password: '123456'
  })
  return result.insertedId.toHexString()
}
