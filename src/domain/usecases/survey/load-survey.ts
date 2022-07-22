import { SurveyModel } from '../../models/survey'

export interface LoadSurvey {
  loadListSurvey: () => Promise<SurveyModel[]>
}
