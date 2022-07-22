
import { MongoHelper } from '../helpers/mongo-helper'
import env from '../../../../main/config/env'
import { Collection } from 'mongodb'
import { AddSurveyModel } from '../../../../domain/usecases/survey/add-survey'
import { SurveyMongoRepository } from '../survey-repository/survey-repository'

let surveyCollection: Collection

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

describe('Survey Repository MongoDB', () => {
  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
  })

  test('Should return an survey on add success', async () => {
    const sut = new SurveyMongoRepository()
    const fakeSurveyModel = makeFakeSurveyModel()

    await sut.add(fakeSurveyModel)
    const result = await surveyCollection.findOne({ question: fakeSurveyModel.question })
    expect(result).toBeTruthy()
  })
})
