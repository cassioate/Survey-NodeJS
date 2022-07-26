import { LoadSurveyById } from '../../../../domain/usecases/survey/load-survey-by-id'
import { DbLoadSurveyById } from '../../../../data/usecases/survey/load-survey/db-load-survey-by-id'
import { SurveyMongoRepository } from '../../../../infra/db/mongodb/survey-repository/survey-repository'

export const makeDbLoadSurveyByIdFactory = (): LoadSurveyById => {
  const surveyResultMongoRepository = new SurveyMongoRepository()
  return new DbLoadSurveyById(surveyResultMongoRepository)
}
