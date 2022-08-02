import { SaveSurveyResultParams } from '../../../../domain/models/survey-result'

export interface SaveSurveyResultRepository {
  save: (saveSurveyResult: SaveSurveyResultParams) => Promise<void>
}
