import { DbAddSurvey } from '../../../../data/usecases/survey/db-add-survey'
import { AddSurvey } from '../../../../domain/usecases/survey/add-survey'
import { SurveyMongoRepository } from '../../../../infra/db/mongodb/survey-repository/survey-repository'

export const makeDbAddSurveyFactory = (): AddSurvey => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbAddSurvey(surveyMongoRepository)
}
