export interface AddAddSurveyModel {
  question: string
  answer: SurveyAnswer[]
}

export interface SurveyAnswer {
  image: string
  answer: string
}

export interface AddSurvey {
  add: (account: AddAddSurveyModel) => Promise<void>
}
