import { DbSaveSurveyResult } from '../../../../src/data/usecases/survey-result/db-save-survey-result'
import { SaveSurveyResultRepository } from '../../../../src/data/protocols/db/db-survey-result/save-survey-result-repository'
import { makeFakeSaveSurveyResultParams, makeFakeSurveyResultModel } from '../../../domain/models/mocks/mock-survey-result'
import { makeLoadByIdSurveyResultRepositoryStub, makeSaveSurveyResultRepositoryStub } from '../../mocks/db-survey-result-mock'
import { LoadByIdSurveyResultRepository } from '../../../../src/data/protocols/db/db-survey-result/load-by-id-survey-result-repository'
import MockDate from 'mockdate'

type SutType = {
  sut: DbSaveSurveyResult
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository
  loadByIdSurveyResultRepositoryStub: LoadByIdSurveyResultRepository
}

const makeSut = (): SutType => {
  const saveSurveyResultRepositoryStub = makeSaveSurveyResultRepositoryStub()
  const loadByIdSurveyResultRepositoryStub = makeLoadByIdSurveyResultRepositoryStub()
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub, loadByIdSurveyResultRepositoryStub)
  return {
    sut,
    saveSurveyResultRepositoryStub,
    loadByIdSurveyResultRepositoryStub
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

  test('Should call saveSurveyResultRepository.save with correct values', async () => {
    const { sut, loadByIdSurveyResultRepositoryStub } = makeSut()
    const spyOn = jest.spyOn(loadByIdSurveyResultRepositoryStub, 'loadBySurveyId')
    await sut.save(makeFakeSaveSurveyResultParams())
    expect(spyOn).toBeCalledWith(makeFakeSaveSurveyResultParams().surveyId)
  })

  test('Should throw if saveSurveyResultRepository.save throws', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(saveSurveyResultRepositoryStub, 'save').mockImplementationOnce(() => {
      throw new Error()
    })
    await expect(sut.save(makeFakeSaveSurveyResultParams())).rejects.toThrow()
  })

  test('Should throw if saveSurveyResultRepository.save throws', async () => {
    const { sut, loadByIdSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(loadByIdSurveyResultRepositoryStub, 'loadBySurveyId').mockImplementationOnce(() => {
      throw new Error()
    })
    await expect(sut.save(makeFakeSaveSurveyResultParams())).rejects.toThrow()
  })

  test('Should return a surveyResult with correct values', async () => {
    const { sut } = makeSut()
    const result = await sut.save(makeFakeSaveSurveyResultParams())
    expect(result).toEqual(makeFakeSurveyResultModel())
  })
})
