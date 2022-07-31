import { SaveSurveyResultParams, SurveyResultModel } from '../../../../domain/models/survey-result'

export interface SaveSurveyResultRepository {
  save: (saveSurveyResult: SaveSurveyResultParams) => Promise<SurveyResultModel>
}
