import { SaveSurveyResultParams, SurveyResultModel } from '../../../../src/domain/models/survey-result'

export const makeFakeSurveyResultModel = (): SurveyResultModel => {
  return {
    id: 'any_id',
    surveyId: 'survey_id',
    accountId: 'account_id',
    answer: 'answer',
    date: new Date()
  }
}

export const makeFakeSaveSurveyResultParams = (): SaveSurveyResultParams => {
  return {
    surveyId: 'survey_id',
    accountId: 'account_id',
    answer: 'answer',
    date: new Date()
  }
}
