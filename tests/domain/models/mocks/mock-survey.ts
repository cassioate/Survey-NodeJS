import { AddSurveyParams, SurveyModel } from '../../../../src/domain/models/survey'

export const makeFakeSurveyParams = (): AddSurveyParams => {
  return {
    question: 'question',
    answers: [{
      image: 'image',
      answer: 'answer'
    }, {
      image: 'image2',
      answer: 'answer2'
    }],
    date: new Date()
  }
}

export const makeFakeSurveyModel = (): SurveyModel => {
  return {
    id: 'any_id',
    question: 'question',
    answers: [{
      image: 'image',
      answer: 'answer'
    }],
    date: new Date()
  }
}
