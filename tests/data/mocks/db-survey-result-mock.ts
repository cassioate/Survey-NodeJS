import { SaveSurveyResultRepository } from '../../../src/data/protocols/db/db-survey-result/save-survey-result-repository'
import { SaveSurveyResultParams, SurveyResultModel } from '../../../src/domain/models/survey-result'
import { makeFakeSurveyResultModel } from '../../domain/models/mocks/mock-survey-result'

export const makeSaveSurveyResultRepositoryStub = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save (saveSurveyResult: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return makeFakeSurveyResultModel()
    }
  }

  return new SaveSurveyResultRepositoryStub()
}
