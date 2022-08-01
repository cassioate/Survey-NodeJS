
import { MongoHelper } from '../../../../../src/infra/db/mongodb/helpers/mongo-helper'
import env from '../../../../../src/main/config/env'
import { Collection } from 'mongodb'
import { SurveyResultMongoRepository } from '../../../../../src/infra/db/mongodb/survey-result-repository/survey-result-repository'
import { makeFakeSaveSurveyResultParamsToDB } from '../../../mocks/db-survey-result-mock'
import { makeFakeAccountInDB } from '../../../mocks/db-account-mocks'

let surveyCollection: Collection
let accountCollection: Collection
let surveyResultsCollection: Collection

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
    test('Should return an SurveyResultModel on save success', async () => {
      const sut = new SurveyResultMongoRepository()
      const fakeRequest = await makeFakeSaveSurveyResultParamsToDB(accountCollection, surveyCollection, 'cassio@gmail.com')

      const result = await sut.save(fakeRequest)
      expect(result).toBeTruthy()
      expect(result.question).toBeTruthy()
      expect(result.answers).toBeTruthy()
      expect(result.surveyId).toEqual(fakeRequest.surveyId)
      expect(result.date).toBeTruthy()
    })

    test('Should return an SurveyResultModel on save success if already has a register in the database', async () => {
      const sut = new SurveyResultMongoRepository()
      const fakeRequest = await makeFakeSaveSurveyResultParamsToDB(accountCollection, surveyCollection, 'cassio@gmail.com')

      const fakeRequestBeforeUpdate = fakeRequest
      fakeRequestBeforeUpdate.answer = 'other'
      await surveyResultsCollection.insertOne(fakeRequestBeforeUpdate)

      const result = await sut.save(fakeRequest)
      expect(result.question).toBeTruthy()
      expect(result.answers).toBeTruthy()
      expect(result.surveyId).toEqual(fakeRequest.surveyId)
      expect(result.date).toBeTruthy()
    })

    test('Should return an SurveyResultModel with all of the answers and percents each one', async () => {
      const sut = new SurveyResultMongoRepository()
      const fakeRequest = await makeFakeSaveSurveyResultParamsToDB(accountCollection, surveyCollection, 'cassio@gmail.com')
      const fakeRequest2 = { ...fakeRequest }
      const fakeRequest3 = { ...fakeRequest }
      const fakeRequest4 = { ...fakeRequest }
      const fakeRequest5 = { ...fakeRequest }
      const fakeRequest6 = { ...fakeRequest }
      const fakeRequest7 = { ...fakeRequest }

      fakeRequest2.accountId = await makeFakeAccountInDB(accountCollection, 'cassio2@gmail.com')
      fakeRequest3.accountId = await makeFakeAccountInDB(accountCollection, 'cassio3@gmail.com')
      fakeRequest4.accountId = await makeFakeAccountInDB(accountCollection, 'cassio4@gmail.com')
      fakeRequest5.accountId = await makeFakeAccountInDB(accountCollection, 'cassio5@gmail.com')
      fakeRequest6.accountId = await makeFakeAccountInDB(accountCollection, 'cassio6@gmail.com')
      fakeRequest7.accountId = await makeFakeAccountInDB(accountCollection, 'cassio7@gmail.com')

      fakeRequest6.answer = 'other'
      fakeRequest7.answer = 'other'

      await surveyResultsCollection.insertMany([fakeRequest, fakeRequest2, fakeRequest3, fakeRequest4, fakeRequest5, fakeRequest6, fakeRequest7])

      const result = await sut.save(fakeRequest)
      expect(result.surveyId).toEqual(fakeRequest.surveyId)
      expect(result.answers[0].answer).toEqual(fakeRequest.answer)
      expect(result.answers[0].count).toBe(5)
      expect(result.answers[1].answer).toEqual(fakeRequest7.answer)
      expect(result.answers[1].count).toBe(2)
      expect(result.date).toBeTruthy()
    })
  })
})
