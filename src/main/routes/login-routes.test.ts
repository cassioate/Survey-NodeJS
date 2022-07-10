
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import request from 'supertest'
import app from '../config/app'
import env from '../config/env'
import { Collection } from 'mongodb'
import bcrypt from 'bcrypt'

let accountCollection: Collection

describe('Login Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('POST /signup', () => {
    test('Should signup return 200 on success', async () => {
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

  describe('POST /login', () => {
    test('Should return 200 if login was successful', async () => {
      const password = await bcrypt.hash('123456', 12)
      await accountCollection.insertOne({
        email: 'cassio@gmail.com',
        password
      })
      const value = await request(app)
        .post('/api/login')
        .send({
          email: 'cassio@gmail.com',
          password: '123456'
        })
        .expect(200)
      expect(value.body.accessToken).toBeTruthy()
      expect(typeof value.body.accessToken).toBe('string')
    })

    test('Should return 401 if login was not successful', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'cassio@gmail.com',
          password: '123456'
        })
        .expect(401)
    })
  })
})
