import { SurveyModel } from '../../../src/domain/models/survey'
import { AddSurvey } from '../../../src/domain/usecases/survey/add-survey'
import { LoadListSurvey } from '../../../src/domain/usecases/survey/load-list-survey'
import { makeFakeListSurvey } from '../../domain/models/mocks/mock-survey'

export const makeAddSurveyStub = (): AddSurvey => {
  class DbAddSurveyStub implements AddSurvey {
    async add (survey: any): Promise<void> {
    }
  }
  return new DbAddSurveyStub()
}

export const makeLoadSurveyStub = (): LoadListSurvey => {
  class DbLoadSurveyStub implements LoadListSurvey {
    async loadListSurvey (): Promise<SurveyModel[]> {
      return makeFakeListSurvey()
    }
  }
  return new DbLoadSurveyStub()
}
