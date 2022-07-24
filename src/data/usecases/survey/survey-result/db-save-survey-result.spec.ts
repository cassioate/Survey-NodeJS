import { DbSaveSurveyResult } from './db-save-survey-result'
import { SaveSurveyResultRepository } from '../../../protocols/db/db-survey/save-survey-result-repository'
import { SurveyResultModel } from '../../../../domain/models/survey-result'
import { SaveSurveyResultModel } from '../../../../domain/usecases/survey/save-survey-result'
import MockDate from 'mockdate'
import { LoadSurveyByIdRepository } from '../../../protocols/db/db-survey/load-survey-by-id-repository'
import { SurveyModel } from '../../../../domain/models/survey'

const makeSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save (saveSurveyResult: SaveSurveyResultModel): Promise<SurveyResultModel> {
      return makeFakeSurveyResultModel()
    }
  }

  return new SaveSurveyResultRepositoryStub()
}

const makeLoadSurveyRepository = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById (): Promise<SurveyModel> {
      return makeFakeSurveyModel()
    }
  }

  return new LoadSurveyByIdRepositoryStub()
}

type SutType = {
  sut: DbSaveSurveyResult
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository
  loadSurveyRepositoryStub: LoadSurveyByIdRepository
}

const makeSut = (): SutType => {
  const saveSurveyResultRepositoryStub = makeSaveSurveyResultRepository()
  const loadSurveyRepositoryStub = makeLoadSurveyRepository()
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub, loadSurveyRepositoryStub)
  return {
    sut,
    saveSurveyResultRepositoryStub,
    loadSurveyRepositoryStub
  }
}

const makeFakeSurveyResultModelRequest = (): SaveSurveyResultModel => {
  return {
    surveyId: 'survey_id',
    accountId: 'account_id',
    answer: 'answer',
    date: new Date()
  }
}

const makeFakeSurveyResultModel = (): SurveyResultModel => {
  return {
    id: 'any_id',
    ...makeFakeSurveyResultModelRequest()
  }
}

const makeFakeSurveyModel = (): SurveyModel => {
  return {
    id: 'any_id',
    question: 'question',
    answers: [{
      image: 'image',
      answer: 'answer'
    }],
    date: new Date()
  }
}

describe('LoadSurveyById', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call saveSurveyResultRepository.save with correct values', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    const spyOn = jest.spyOn(saveSurveyResultRepositoryStub, 'save')
    await sut.save(makeFakeSurveyResultModelRequest())
    expect(spyOn).toBeCalledWith(makeFakeSurveyResultModelRequest())
  })

  test('Should return a surveyResult with correct values', async () => {
    const { sut } = makeSut()
    const result = await sut.save(makeFakeSurveyResultModelRequest())
    expect(result).toEqual(makeFakeSurveyResultModel())
  })

  test('Should throw if saveSurveyResultRepository.save throws', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(saveSurveyResultRepositoryStub, 'save').mockImplementationOnce(() => {
      throw new Error()
    })
    await expect(sut.save(makeFakeSurveyResultModelRequest())).rejects.toThrow()
  })
})
