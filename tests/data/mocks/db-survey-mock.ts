import { AddSurveyRepository } from '../../../src/data/protocols/db/db-survey/add-survey-repository'
import { LoadSurveyByIdRepository } from '../../../src/data/protocols/db/db-survey/load-survey-by-id-repository'
import { LoadListSurveyRepository } from '../../../src/data/protocols/db/db-survey/load-survey-repository'
import { AddSurveyParams, SurveyModel } from '../../../src/domain/models/survey'
import { makeFakeListSurvey, makeFakeSurveyModel } from '../../domain/models/mocks/mock-survey'

export const makeAddSurveyRepositoryStub = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add (value: AddSurveyParams): Promise<void> {
    }
  }
  return new AddSurveyRepositoryStub()
}

export const makeLoadSurveyRepositoryStub = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById (): Promise<SurveyModel> {
      return makeFakeSurveyModel()
    }
  }

  return new LoadSurveyByIdRepositoryStub()
}

export const makeLoadListSurveyRepositoryStub = (): LoadListSurveyRepository => {
  class LoadListSurveyRepositoryStub implements LoadListSurveyRepository {
    async loadListSurvey (): Promise<SurveyModel[]> {
      return makeFakeListSurvey()
    }
  }
  return new LoadListSurveyRepositoryStub()
}
