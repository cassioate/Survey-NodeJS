import env from '../../../../../src/main/config/env'
import { MongoHelper } from '../../../../../src/infra/db/mongodb/helpers/mongo-helper'

describe('Mongo Helper', () => {
  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl)
  })

  afterAll(async () => {

  })

  test('Should reconnect if mongodb is down', async () => {
    let accountCollection = await MongoHelper.getCollection('accounts')
    expect(accountCollection).toBeTruthy()
    await MongoHelper.disconnect()
    accountCollection = await MongoHelper.getCollection('accounts')
    expect(accountCollection).toBeTruthy()
  })
})
