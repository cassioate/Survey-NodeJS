import { SurveyResultModel } from '../../models/survey-result'

type SaveSurveyResultModel = Omit<SurveyResultModel, 'id'>

export interface SaveSurveyResult {
  SaveSurveyResult: (saveSurveyResult: SaveSurveyResultModel) => Promise<SurveyResultModel>
}
