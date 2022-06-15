import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account-repository'

describe('Account Repository MongoDB', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('Should return an account on success', async () => {
    const sut = new AccountMongoRepository()
    const result = await sut.add({
      name: 'any_name',
      email: 'any_email',
      password: 'any_password'
    })

    expect(result).toBeTruthy()
    expect(result.id).toBeTruthy()
    expect(result.name).toBe('any_name')
    expect(result.email).toBe('any_email')
    expect(result.password).toBe('any_password')
  })
})
