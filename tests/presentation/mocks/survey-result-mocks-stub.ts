import { SurveyModel } from '../../../src/domain/models/survey'
import { SaveSurveyResultParams, SurveyResultModel } from '../../../src/domain/models/survey-result'
import { SaveSurveyResult } from '../../../src/domain/usecases/survey-result/save-survey-result'
import { LoadSurveyById } from '../../../src/domain/usecases/survey/load-survey-by-id'
import { makeFakeSurveyModel } from '../../domain/models/mocks/mock-survey'
import { makeFakeSurveyResultModel } from '../../domain/models/mocks/mock-survey-result'

export const makeLoadSurveyRepositoryStub = (): LoadSurveyById => {
  class LoadSurveyRepositoryStub implements LoadSurveyById {
    async loadById (id: string): Promise<SurveyModel> {
      return makeFakeSurveyModel()
    }
  }
  return new LoadSurveyRepositoryStub()
}

export const makeSaveSurveyResultRepositoryStub = (): SaveSurveyResult => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResult {
    async save (saveSurveyResult: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return makeFakeSurveyResultModel()
    }
  }
  return new SaveSurveyResultRepositoryStub()
}
