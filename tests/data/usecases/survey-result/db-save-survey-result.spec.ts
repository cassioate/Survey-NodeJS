import { DbSaveSurveyResult } from '../../../../src/data/usecases/survey-result/db-save-survey-result'
import { SaveSurveyResultRepository } from '../../../../src/data/protocols/db/db-survey-result/save-survey-result-repository'
import { makeFakeSaveSurveyResultParams, makeFakeSurveyResultModel } from '../../../domain/models/mocks/mock-survey-result'
import { makeSaveSurveyResultRepositoryStub } from '../../mocks/db-survey-result-mock'
import MockDate from 'mockdate'

type SutType = {
  sut: DbSaveSurveyResult
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository
}

const makeSut = (): SutType => {
  const saveSurveyResultRepositoryStub = makeSaveSurveyResultRepositoryStub()
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub)
  return {
    sut,
    saveSurveyResultRepositoryStub
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
    await sut.save(makeFakeSaveSurveyResultParams())
    expect(spyOn).toBeCalledWith(makeFakeSaveSurveyResultParams())
  })

  test('Should return a surveyResult with correct values', async () => {
    const { sut } = makeSut()
    const result = await sut.save(makeFakeSaveSurveyResultParams())
    expect(result).toEqual(makeFakeSurveyResultModel())
  })

  test('Should throw if saveSurveyResultRepository.save throws', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(saveSurveyResultRepositoryStub, 'save').mockImplementationOnce(() => {
      throw new Error()
    })
    await expect(sut.save(makeFakeSaveSurveyResultParams())).rejects.toThrow()
  })
})
