
import { MongoHelper } from '../../../src/infra/db/mongodb/helpers/mongo-helper'
import request from 'supertest'
import app from '../../../src/main/config/app'
import env from '../../../src/main/config/env'
import { Collection } from 'mongodb'
import { setUpRoles } from '../../../src/main/config/roles'
import { findSurveyInDatabase, insertSurveyInDatabase, makeAccessToken, makeAnswer } from '../mocks/routes-mocks'

let surveyCollection: Collection
let accountCollection: Collection
describe('Survey Result Routes', () => {
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

  describe('POST /api/surveys/any_id/results', () => {
    test('Should survey add return 403 if user not has a token', async () => {
      await request(app)
        .put('/api/surveys/any_id/results')
        .send({})
        .expect(403)
    })

    test('Should survey-results return 200 on success', async () => {
      const accessToken = await makeAccessToken(accountCollection, 1, 'admin')
      await insertSurveyInDatabase(surveyCollection)
      const { id } = await findSurveyInDatabase(surveyCollection)

      await request(app)
        .put(`/api/surveys/${id}/results`)
        .set('x-access-token', accessToken)
        .send(makeAnswer())
        .expect(200)
    })
  })

  describe('GET /api/surveys/any_id/results', () => {
    test('Should survey add return 403 if user not has a token', async () => {
      await request(app)
        .get('/api/surveys/any_id/results')
        .send({})
        .expect(403)
    })

    test('Should survey-results return 200 on success', async () => {
      const accessToken = await makeAccessToken(accountCollection, 3, 'user')
      await insertSurveyInDatabase(surveyCollection)
      const { id } = await findSurveyInDatabase(surveyCollection)

      await request(app)
        .get(`/api/surveys/${id}/results`)
        .set('x-access-token', accessToken)
        .send({})
        .expect(200)
    })
  })
})
