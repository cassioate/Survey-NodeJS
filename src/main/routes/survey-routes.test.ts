
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import request from 'supertest'
import app from '../config/app'
import env from '../config/env'
import { Collection } from 'mongodb'
import { AddSurveyModel } from '../../domain/usecases/survey/add-survey'
import { JwtAdapter } from '../../infra/criptography/jwt-adapter/jwt-adapter'
import { setUpRoles } from '../../main/config/roles'

let surveyCollection: Collection
let accountCollection: Collection

const makeFakeSurveyModel = (): AddSurveyModel => {
  return {
    question: 'question',
    answers: [{
      image: 'image',
      answer: 'answer'
    }],
    date: new Date()
  }
}

describe('Survey Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl)
    await setUpRoles()
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})

    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('POST /survey/add', () => {
    test('Should survey add return 403 if user not has a token', async () => {
      await request(app)
        .post('/api/survey/add')
        .send(makeFakeSurveyModel())
        .expect(403)
    })

    test('Should survey add return 204 on success', async () => {
      const account = await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email',
        password: 'any_password',
        role: {
          id: 1,
          value: 'admin'
        }
      })

      const jwtAdapter = new JwtAdapter(env.jwtSecret)
      const accessToken = await jwtAdapter.encrypt(account.insertedId.toString())

      await accountCollection.updateOne({
        _id: account.insertedId
      }, {
        $set: {
          accessToken
        }
      })

      await request(app)
        .post('/api/survey/add')
        .set('x-access-token', accessToken)
        .send(makeFakeSurveyModel())
        .expect(204)
    })

    test('Should survey add return 403 if token is invalid', async () => {
      const account = await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email',
        password: 'any_password',
        role: {
          id: 1,
          value: 'admin'
        }
      })

      const accessToken = 'invalid_access_token'

      await accountCollection.updateOne({
        _id: account.insertedId
      }, {
        $set: {
          accessToken
        }
      })

      await request(app)
        .post('/api/survey/add')
        .set('x-access-token', accessToken)
        .send(makeFakeSurveyModel())
        .expect(403)
    })

    test('Should survey add return 403 if the accessToken is valid but the role is wrong', async () => {
      const account = await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email',
        password: 'any_password',
        role: {
          id: 3,
          value: 'user'
        }
      })

      const jwtAdapter = new JwtAdapter(env.jwtSecret)
      const accessToken = await jwtAdapter.encrypt(account.insertedId.toString())

      await accountCollection.updateOne({
        _id: account.insertedId
      }, {
        $set: {
          accessToken
        }
      })

      await request(app)
        .post('/api/survey/add')
        .set('x-access-token', accessToken)
        .send(makeFakeSurveyModel())
        .expect(403)
    })
  })

  describe('GET /survey/list', () => {
    test('Should survey add return 403 if user not has a token', async () => {
      await request(app)
        .get('/api/survey/list')
        .expect(403)
    })

    test('Should survey list return 200 on success', async () => {
      const account = await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email',
        password: 'any_password',
        role: {
          id: 3,
          value: 'admin'
        }
      })

      const jwtAdapter = new JwtAdapter(env.jwtSecret)
      const accessToken = await jwtAdapter.encrypt(account.insertedId.toString())

      await accountCollection.updateOne({
        _id: account.insertedId
      }, {
        $set: {
          accessToken
        }
      })

      await surveyCollection.insertMany([makeFakeSurveyModel()])

      await request(app)
        .get('/api/survey/list')
        .set('x-access-token', accessToken)
        .expect(200)
    })
  })
})
