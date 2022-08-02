import { DbLoadByIdSurveyResult } from '../../../../data/usecases/survey-result/db-load-by-id-survey-result'
import { LoadSurveyResultById } from '../../../../domain/usecases/survey-result/load-survey-result'
import { SurveyResultMongoRepository } from '../../../../infra/db/mongodb/survey-result-repository/survey-result-repository'

export const makeDbLoadSurveyResultByIdFactory = (): LoadSurveyResultById => {
  const loadBySurveyIdResultMongoRepository = new SurveyResultMongoRepository()
  return new DbLoadByIdSurveyResult(loadBySurveyIdResultMongoRepository)
}
