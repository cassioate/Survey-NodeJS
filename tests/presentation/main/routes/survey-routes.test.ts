
import { MongoHelper } from '../../../../src/infra/db/mongodb/helpers/mongo-helper'
import request from 'supertest'
import app from '../../../../src/main/config/app'
import env from '../../../../src/main/config/env'
import { Collection } from 'mongodb'
import { JwtAdapter } from '../../../../src/infra/criptography/jwt-adapter/jwt-adapter'
import { setUpRoles } from '../../../../src/main/config/roles'
import { AddSurveyParams } from '../../../../src/domain/models/survey'

let surveyCollection: Collection
let accountCollection: Collection

const makeAccessToken = async (roleId: number, role: string): Promise<string> => {
  const account = await accountCollection.insertOne({
    name: 'any_name',
    email: 'any_email',
    password: 'any_password',
    role: {
      id: roleId,
      value: role
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

  return accessToken
}

const makeFakeSurveyModel = (): AddSurveyParams => {
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
      const accessToken = await makeAccessToken(1, 'admin')

      await request(app)
        .post('/api/survey/add')
        .set('x-access-token', accessToken)
        .send(makeFakeSurveyModel())
        .expect(204)
    })

    test('Should survey add return 403 if token is invalid', async () => {
      const accessToken = 'invalid_access_token'

      await request(app)
        .post('/api/survey/add')
        .set('x-access-token', accessToken)
        .send(makeFakeSurveyModel())
        .expect(403)
    })

    test('Should survey add return 403 if the accessToken is valid but the role is wrong', async () => {
      const accessToken = await makeAccessToken(3, 'user')

      await request(app)
        .post('/api/survey/add')
        .set('x-access-token', accessToken)
        .send(makeFakeSurveyModel())
        .expect(403)
    })
  })

  describe('GET /survey/list', () => {
    test('Should survey list return 403 if user not has a token', async () => {
      await request(app)
        .get('/api/survey/list')
        .expect(403)
    })

    test('Should survey list return 403 if user not has the role necessary to access', async () => {
      // Used makeAccessToken with Id 100, and "NO_EXIST" because the user need to have a role that is not null.
      const accessToken = await makeAccessToken(100, 'NO_EXIST')
      await surveyCollection.insertMany([makeFakeSurveyModel()])
      await request(app)
        .get('/api/survey/list')
        .set('x-access-token', accessToken)
        .expect(403)
    })

    test('Should survey list be access at lest by one user and return 200 on success', async () => {
      const accessToken = await makeAccessToken(3, 'user')
      await surveyCollection.insertMany([makeFakeSurveyModel()])
      await request(app)
        .get('/api/survey/list')
        .set('x-access-token', accessToken)
        .expect(200)
    })

    test('Should survey list be access at lest by one user and return 204 on success, if return a empty array', async () => {
      const accessToken = await makeAccessToken(3, 'user')
      await request(app)
        .get('/api/survey/list')
        .set('x-access-token', accessToken)
        .expect(204)
    })

    test('Should return 404 if route is wrong', async () => {
      const accessToken = await makeAccessToken(3, 'user')
      await request(app)
        .get('/api/survey/listWRONG')
        .set('x-access-token', accessToken)
        .expect(404)
    })
  })
})
