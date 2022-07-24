import { DbSaveSurveyResult } from './db-save-survey-result'
import { SurveyResultModel } from '../../../domain/models/survey-result'
import { SaveSurveyResultModel } from '../../../domain/usecases/survey-result/save-survey-result'
import MockDate from 'mockdate'
import { SaveSurveyResultRepository } from '../../protocols/db/db-survey-result/save-survey-result-repository'

const makeSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save (saveSurveyResult: SaveSurveyResultModel): Promise<SurveyResultModel> {
      return makeFakeSurveyResultModel()
    }
  }

  return new SaveSurveyResultRepositoryStub()
}

type SutType = {
  sut: DbSaveSurveyResult
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository
}

const makeSut = (): SutType => {
  const saveSurveyResultRepositoryStub = makeSaveSurveyResultRepository()
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub)
  return {
    sut,
    saveSurveyResultRepositoryStub
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
