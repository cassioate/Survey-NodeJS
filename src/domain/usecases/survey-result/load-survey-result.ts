import { SurveyResultModel } from '../../models/survey-result'

export interface LoadSurveyResultById {
  loadBySurveyId: (surveyId: string) => Promise<SurveyResultModel>
}
