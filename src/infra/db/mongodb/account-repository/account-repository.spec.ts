
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account-repository'
import env from '../../../../main/config/env'

describe('Account Repository MongoDB', () => {
  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
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
