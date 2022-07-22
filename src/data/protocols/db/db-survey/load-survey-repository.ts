import { SurveyModel } from '../../../../domain/models/survey'

export interface LoadListSurveyRepository {
  loadListSurvey: () => Promise<SurveyModel[]>
}
