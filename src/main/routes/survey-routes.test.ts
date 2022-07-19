
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import request from 'supertest'
import app from '../config/app'
import env from '../config/env'
import { Collection } from 'mongodb'
import { AddSurveyModel } from '../../domain/usecases/survey/add-survey'

let surveyCollection: Collection

const makeFakeSurveyModel = (): AddSurveyModel => {
  return {
    question: 'question',
    answers: [{
      image: 'image',
      answer: 'answer'
    }]
  }
}

describe('Survey Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('survey')
    await surveyCollection.deleteMany({})
  })

  describe('POST /survey/add', () => {
    test('Should survey add return 204 on success', async () => {
      await request(app)
        .post('/api/survey/add')
        .send(makeFakeSurveyModel())
        .expect(403)
    })
  })
})
