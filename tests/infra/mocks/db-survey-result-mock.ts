import { Collection } from 'mongodb'
import { SaveSurveyResultParams } from '../../../src/domain/models/survey-result'
import { makeFakeAccountInDB } from './db-account-mocks'
import { makeFakeSurveyInDB } from './db-survey-mocks'

export const makeFakeSaveSurveyResultParamsToDB = async (accountCollection: Collection,
  surveyCollection: Collection): Promise<SaveSurveyResultParams> => {
  return {
    surveyId: await makeFakeSurveyInDB(surveyCollection),
    accountId: await makeFakeAccountInDB(accountCollection),
    answer: 'answer',
    date: new Date()
  }
}
