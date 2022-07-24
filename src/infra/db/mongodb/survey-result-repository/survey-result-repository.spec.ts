
import { MongoHelper } from '../helpers/mongo-helper'
import env from '../../../../main/config/env'
import { Collection, ObjectId } from 'mongodb'
import { SurveyResultsMongoRepository } from './survey-result-repository'
import { SaveSurveyResultModel } from '../../../../domain/usecases/survey/save-survey-result'

let surveyCollection: Collection
let accountCollection: Collection
let surveyResultsCollection: Collection

const makeFakeAccountId = async (): Promise<string> => {
  const result = await accountCollection.insertOne({
    name: 'cassio',
    email: 'cassio@gmail.com',
    password: '123456'
  })
  return result.insertedId.toHexString()
}

const makeFakeSurveyId = async (): Promise<string> => {
  const result = await surveyCollection.insertOne({
    question: 'question',
    answers: [{
      image: 'image',
      answer: 'answer'
    }],
    date: new Date()
  })
  return result.insertedId.toHexString()
}

const makeFakeSurveyResultModelRequest = async (): Promise<SaveSurveyResultModel> => {
  return {
    surveyId: await makeFakeSurveyId(),
    accountId: await makeFakeAccountId(),
    answer: 'answer',
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
    surveyResultsCollection = await MongoHelper.getCollection('surveyResults')
    await surveyResultsCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('SurveyResultsRepository', () => {
    test('Should return an survey on save success', async () => {
      const sut = new SurveyResultsMongoRepository()
      const fakeRequest = await makeFakeSurveyResultModelRequest()
      const result = await sut.save(fakeRequest)
      expect(result).toBeTruthy()
      expect(result.id).toBeTruthy()
      expect(result.accountId.toString()).toEqual(fakeRequest.accountId)
      expect(result.surveyId.toString()).toEqual(fakeRequest.surveyId)
      expect(result.answer).toEqual(fakeRequest.answer)
    })

    test('Should return an survey on save success if already has a register in the database', async () => {
      const sut = new SurveyResultsMongoRepository()
      const fakeRequest = await makeFakeSurveyResultModelRequest()

      const saved = await surveyResultsCollection.insertOne({
        surveyId: new ObjectId(fakeRequest.surveyId),
        accountId: new ObjectId(fakeRequest.accountId),
        answer: 'answerBeforeUpdate',
        date: new Date()
      })

      const result = await sut.save(fakeRequest)
      expect(result.id.toString()).toEqual(saved.insertedId.toString())
      expect(result.accountId.toString()).toEqual(fakeRequest.accountId)
      expect(result.surveyId.toString()).toEqual(fakeRequest.surveyId)
      expect(result.answer).toEqual(fakeRequest.answer)
    })
  })
})
