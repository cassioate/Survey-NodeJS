import { Collection, ObjectId } from 'mongodb'
import { makeFakeAccountInDB } from './db-account-mocks'
import { makeFakeSurveyInDB } from './db-survey-mocks'

export const makeFakeSaveSurveyResultParamsToDB = async (accountCollection: Collection,
  surveyCollection: Collection, email: string): Promise<any> => {
  return {
    surveyId: new ObjectId(await makeFakeSurveyInDB(surveyCollection)),
    accountId: new ObjectId(await makeFakeAccountInDB(accountCollection, email)),
    answer: 'answer',
    date: new Date()
  }
}
