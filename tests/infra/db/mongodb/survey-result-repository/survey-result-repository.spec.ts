
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

  describe('SaveSurveyResultRepository', () => {
    test('Should save answer on success', async () => {
      const sut = new SurveyResultMongoRepository()
      const fakeRequest = await makeFakeSaveSurveyResultParamsToDB(accountCollection, surveyCollection, 'cassio@gmail.com')

      await sut.save(fakeRequest)
      const result = await surveyResultsCollection.find({
        surveyId: fakeRequest.surveyId,
        accountId: fakeRequest.accountId
      }).toArray()
      expect(result[0].accountId).toEqual(fakeRequest.accountId)
      expect(result[0].surveyId).toEqual(fakeRequest.surveyId)
    })

    test('Should update if already has a register a vote in this survey', async () => {
      const sut = new SurveyResultMongoRepository()

      const fakeRequest = await makeFakeSaveSurveyResultParamsToDB(accountCollection, surveyCollection, 'cassio@gmail.com')
      await surveyResultsCollection.insertOne(fakeRequest)
      const resultBefore = await surveyResultsCollection.find({
        surveyId: fakeRequest.surveyId,
        accountId: fakeRequest.accountId
      }).toArray()
      expect(resultBefore[0].answer).toEqual(fakeRequest.answer)
      expect(resultBefore[0].accountId).toEqual(fakeRequest.accountId)
      expect(resultBefore[0].surveyId).toEqual(fakeRequest.surveyId)

      const fakeRequestAfter = {
        ...fakeRequest,
        answer: 'other'
      }
      await sut.save(fakeRequestAfter)
      const resultAfter = await surveyResultsCollection.find({
        surveyId: fakeRequest.surveyId,
        accountId: fakeRequest.accountId
      }).toArray()
      expect(resultAfter[0].answer).toEqual(fakeRequestAfter.answer)
      expect(resultAfter[0].accountId).toEqual(fakeRequestAfter.accountId)
      expect(resultAfter[0].surveyId).toEqual(fakeRequestAfter.surveyId)
    })
  })

  describe('LoadByIdSurveyResultRepository', () => {
    test('Should loadBySurveyId return an SurveyResultModel with all of the answers and percents each one', async () => {
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

      const result = await sut.loadBySurveyId(fakeRequest.surveyId)
      expect(result.surveyId).toEqual(fakeRequest.surveyId)
      expect(result.answers[0].answer).toEqual(fakeRequest.answer)
      expect(result.answers[0].count).toBe(5)
      expect(result.answers[1].answer).toEqual(fakeRequest7.answer)
      expect(result.answers[1].count).toBe(2)
      expect(result.answers[2].answer).toEqual('no_answer')
      expect(result.answers[2].count).toBe(0)
      expect(result.date).toBeTruthy()
    })

    test('Should loadBySurveyId return null', async () => {
      const sut = new SurveyResultMongoRepository()
      const result = await sut.loadBySurveyId('62df6c8b63ebdfc3a494da4b')
      expect(result).toBe(null)
    })
  })
})
