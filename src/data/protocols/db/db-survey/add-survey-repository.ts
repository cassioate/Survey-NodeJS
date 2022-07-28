import { AddSurveyParams } from '../../../../domain/models/survey'

export interface AddSurveyRepository {
  add: (surveyData: AddSurveyParams) => Promise<void>
}
