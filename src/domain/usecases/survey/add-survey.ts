import { AddSurveyParams } from '../../models/survey'

export interface AddSurvey {
  add: (survey: AddSurveyParams) => Promise<void>
}
