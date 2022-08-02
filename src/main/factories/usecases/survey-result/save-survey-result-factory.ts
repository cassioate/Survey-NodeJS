import { DbSaveSurveyResult } from '../../../../data/usecases/survey-result/db-save-survey-result'
import { SurveyResultMongoRepository } from '../../../../infra/db/mongodb/survey-result-repository/survey-result-repository'
import { SaveSurveyResult } from '../../../../domain/usecases/survey-result/save-survey-result'

export const makeDbSaveSurveyResultFactory = (): SaveSurveyResult => {
  const surveyResultMongoRepository = new SurveyResultMongoRepository()
  return new DbSaveSurveyResult(surveyResultMongoRepository, surveyResultMongoRepository)
}
