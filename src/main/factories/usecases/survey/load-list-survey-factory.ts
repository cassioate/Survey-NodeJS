import { DbLoadListSurvey } from '../../../../data/usecases/survey/load-list-survey/db-load-list-survey'
import { LoadListSurvey } from '../../../../domain/usecases/survey/load-list-survey'
import { SurveyMongoRepository } from '../../../../infra/db/mongodb/survey-repository/survey-repository'

export const makeDbLoadListSurveyFactory = (): LoadListSurvey => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbLoadListSurvey(surveyMongoRepository)
}
