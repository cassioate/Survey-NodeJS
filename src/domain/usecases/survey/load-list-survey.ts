import { SurveyModel } from '../../models/survey'

export interface LoadListSurvey {
  loadListSurvey: () => Promise<SurveyModel[]>
}
