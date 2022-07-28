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

export const makeFakeListSurvey = (): SurveyModel[] => {
  const listSurvey = [
    {
      id: 'any_id',
      question: 'any_question',
      answers: [{
        answer: 'any_answer',
        image: 'any_image'
      },
      {
        answer: 'any_answer2',
        image: 'any_image2'
      }],
      date: new Date()
    },
    {
      id: 'any_id2',
      question: 'any_question2',
      answers: [{
        answer: 'any_answer',
        image: 'any_image'
      },
      {
        answer: 'any_answer2',
        image: 'any_image2'
      },
      {
        answer: 'any_answer3',
        image: 'any_image3'
      },
      {
        answer: 'any_answer4',
        image: 'any_image4'
      }
      ],
      date: new Date()
    }
  ]

  return listSurvey
}
