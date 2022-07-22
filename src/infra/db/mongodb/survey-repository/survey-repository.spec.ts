
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

  describe('AddSurveyRepository', () => {
    test('Should return an survey on add success', async () => {
      const sut = new SurveyMongoRepository()
      const fakeSurveyModel = makeFakeSurveyModel()

      await sut.add(fakeSurveyModel)
      const result = await surveyCollection.findOne({ question: fakeSurveyModel.question })
      expect(result).toBeTruthy()
    })
  })

  describe('LoadListSurveyRepository', () => {
    test('Should return an array of Surveys on success', async () => {
      const sut = new SurveyMongoRepository()
      const otherSurveyModel = makeFakeSurveyModel()
      otherSurveyModel.question = 'other_question'
      await surveyCollection.insertMany([makeFakeSurveyModel(), otherSurveyModel])

      const listSurvey = await sut.loadListSurvey()
      expect(listSurvey[0].id).toBeTruthy()
      expect(listSurvey[0].question).toEqual('question')
      expect(listSurvey[1].id).toBeTruthy()
      expect(listSurvey[1].question).toEqual('other_question')
      expect(listSurvey.length).toBe(2)
    })

    test('Should return an empty array on success', async () => {
      const sut = new SurveyMongoRepository()
      const listSurvey = await sut.loadListSurvey()
      expect(listSurvey.length).toBe(0)
    })
  })
})
