
import { MongoHelper } from '../../../src/infra/db/mongodb/helpers/mongo-helper'
import request from 'supertest'
import app from '../../../src/main/config/app'
import env from '../../../src/main/config/env'
import { Collection } from 'mongodb'
import { setUpRoles } from '../../../src/main/config/roles'
import { makeAccessToken } from '../mocks/routes-mocks'
import { makeFakeSurveyModelParam } from '../../domain/models/mocks/mock-survey'

let surveyCollection: Collection
let accountCollection: Collection

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

  describe('POST /surveys', () => {
    test('Should survey add return 403 if user not has a token', async () => {
      await request(app)
        .post('/api/surveys')
        .send(makeFakeSurveyModelParam())
        .expect(403)
    })

    test('Should survey add return 204 on success', async () => {
      const accessToken = await makeAccessToken(accountCollection, 1, 'admin')

      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send(makeFakeSurveyModelParam())
        .expect(204)
    })

    test('Should survey add return 403 if token is invalid', async () => {
      const accessToken = 'invalid_access_token'

      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send(makeFakeSurveyModelParam())
        .expect(403)
    })

    test('Should survey add return 403 if the accessToken is valid but the role is wrong', async () => {
      const accessToken = await makeAccessToken(accountCollection, 3, 'user')

      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send(makeFakeSurveyModelParam())
        .expect(403)
    })
  })

  describe('GET /survey/list', () => {
    test('Should survey list return 403 if user not has a token', async () => {
      await request(app)
        .get('/api/surveys')
        .expect(403)
    })

    test('Should survey list return 403 if user not has the role necessary to access', async () => {
      // Used makeAccessToken with Id 100, and "NO_EXIST" because the user need to have a role that is not null.
      const accessToken = await makeAccessToken(accountCollection, 100, 'NO_EXIST')
      await surveyCollection.insertMany([makeFakeSurveyModelParam()])
      await request(app)
        .get('/api/surveys')
        .set('x-access-token', accessToken)
        .expect(403)
    })

    test('Should survey list be access at lest by one user and return 200 on success', async () => {
      const accessToken = await makeAccessToken(accountCollection, 3, 'user')
      await surveyCollection.insertMany([makeFakeSurveyModelParam()])
      await request(app)
        .get('/api/surveys')
        .set('x-access-token', accessToken)
        .expect(200)
    })

    test('Should survey list be access at lest by one user and return 204 on success, if return a empty array', async () => {
      const accessToken = await makeAccessToken(accountCollection, 3, 'user')
      await request(app)
        .get('/api/surveys')
        .set('x-access-token', accessToken)
        .expect(204)
    })

    test('Should return 404 if route is wrong', async () => {
      const accessToken = await makeAccessToken(accountCollection, 3, 'user')
      await request(app)
        .get('/api/surveysWRONG')
        .set('x-access-token', accessToken)
        .expect(404)
    })
  })
})
