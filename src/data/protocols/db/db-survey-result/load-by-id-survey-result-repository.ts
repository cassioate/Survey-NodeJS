import { SurveyResultModel } from '../../../../domain/models/survey-result'

export interface LoadByIdSurveyResultRepository {
  loadBySurveyId: (surveyId: string) => Promise<SurveyResultModel>
}
