export type SaveSurveyResultParams = {
  surveyId: string
  accountId: string
  answer: string
  date: Date
}

export type SurveyResultModel = {
  surveyId: string
  question: string
  answers: AnswerSurveyResultModel[]
  date: Date
}

export interface AnswerSurveyResultModel {
  image?: string
  answer: string
  count: number
  percent: number
}
