
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import request from 'supertest'
import app from '../config/app'
import env from '../config/env'

describe('SignUp Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })
  test('Should return an account on success', async () => {
    const value = await request(app)
      .post('/api/signup')
      .send({
        name: 'cassioTeste',
        email: 'cassio@gmail.com',
        password: '123456',
        passwordConfirmation: '123456'
      })
      .expect(200)
    expect(value.body.name).toEqual('cassioTeste')
    expect(value.body.email).toEqual('cassio@gmail.com')
    expect(value.body.password).toBeTruthy()
  })
})
