
import { MongoHelper } from '../helpers/mongo-helper'
import env from '../../../../main/config/env'
import { Collection } from 'mongodb'
import { AddSurveyModel } from '../../../../domain/usecases/survey/add-survey'
import { SurveyMongoRepository } from '../survey-repository/survey-repository'

let accountCollection: Collection

const makeFakeSurveyModel = (): AddSurveyModel => {
  return {
    question: 'question',
    answers: [{
      image: 'image',
      answer: 'answer'
    }]
  }
}

describe('Account Repository MongoDB', () => {
  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('survey')
    await accountCollection.deleteMany({})
  })

  test('Should return an survey on add success', async () => {
    const sut = new SurveyMongoRepository()
    const fakeSurveyModel = makeFakeSurveyModel()
    const result = await sut.add(fakeSurveyModel)

    expect(result).toBeTruthy()
    expect(result.id).toBeTruthy()
    expect(result.question).toEqual(fakeSurveyModel.question)
    expect(result.answers).toEqual(fakeSurveyModel.answers)
  })
})
