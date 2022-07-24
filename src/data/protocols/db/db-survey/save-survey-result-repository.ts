import { SurveyResultModel } from '../../../../domain/models/survey-result'
import { SaveSurveyResultModel } from '../../../../domain/usecases/survey/save-survey-result'

export interface SaveSurveyResultRepository {
  save: (saveSurveyResult: SaveSurveyResultModel) => Promise<SurveyResultModel>
}
