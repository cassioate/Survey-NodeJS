import { SurveyResultModel } from '../../models/survey-result'

export interface LoadSurveyResult {
  loadBySurveyId: (surveyId: string) => Promise<SurveyResultModel>
}
