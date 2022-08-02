import { SurveyModel } from '../../../src/domain/models/survey'
import { SaveSurveyResultParams, SurveyResultModel } from '../../../src/domain/models/survey-result'
import { LoadSurveyResultById } from '../../../src/domain/usecases/survey-result/load-survey-result'
import { SaveSurveyResult } from '../../../src/domain/usecases/survey-result/save-survey-result'
import { LoadSurveyById } from '../../../src/domain/usecases/survey/load-survey-by-id'
import { makeFakeSurveyModel } from '../../domain/models/mocks/mock-survey'
import { makeFakeSurveyResultModel } from '../../domain/models/mocks/mock-survey-result'

export const makeLoadSurveyByIdStub = (): LoadSurveyById => {
  class LoadSurveyRepositoryStub implements LoadSurveyById {
    async loadById (id: string): Promise<SurveyModel> {
      return makeFakeSurveyModel()
    }
  }
  return new LoadSurveyRepositoryStub()
}

export const makeSaveSurveyResultStub = (): SaveSurveyResult => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResult {
    async save (saveSurveyResult: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return makeFakeSurveyResultModel()
    }
  }
  return new SaveSurveyResultRepositoryStub()
}

export const makeLoadSurveyResultById = (): LoadSurveyResultById => {
  class LoadSurveyResultByIdStub implements LoadSurveyResultById {
    async loadBySurveyId (surveyId: string): Promise<SurveyResultModel> {
      return makeFakeSurveyResultModel()
    }
  }
  return new LoadSurveyResultByIdStub()
}
