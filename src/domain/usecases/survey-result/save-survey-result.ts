import { SaveSurveyResultParams, SurveyResultModel } from '../../models/survey-result'

export interface SaveSurveyResult {
  save: (saveSurveyResult: SaveSurveyResultParams) => Promise<SurveyResultModel>
}
