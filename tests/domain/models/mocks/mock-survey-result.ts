import { SaveSurveyResultParams, SurveyResultModel } from '../../../../src/domain/models/survey-result'
import { HttpRequest } from '../../../../src/presentation/protocols'

export const makeFakeSurveyResultHttpRequest = (): HttpRequest => {
  return {
    params: {
      surveyId: 'any_id'
    },
    body: {
      answer: 'answer'
    },
    accountId: 'any_account_id'
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

export const makeFakeSurveyResultModel = (): SurveyResultModel => {
  return {
    surveyId: 'survey_id',
    question: 'question',
    answers: [{
      image: 'image',
      answer: 'answer',
      count: 2,
      percent: 50
    }, {
      image: 'image2',
      answer: 'answer2',
      count: 1,
      percent: 25
    }, {
      image: 'image3',
      answer: 'answer3',
      count: 1,
      percent: 25
    }
    ],
    date: new Date()
  }
}
