import { LoadByIdSurveyResultRepository } from '../../../../src/data/protocols/db/db-survey-result/load-by-id-survey-result-repository'
import { DbLoadByIdSurveyResult } from '../../../../src/data/usecases/survey-result/db-load-by-id-survey-result'
import { makeLoadByIdSurveyResultRepositoryStub } from '../../mocks/db-survey-result-mock'
import MockDate from 'mockdate'
import { makeFakeSurveyResultModel } from '../../../domain/models/mocks/mock-survey-result'

type SutType = {
  sut: DbLoadByIdSurveyResult
  loadByIdSurveyResultRepository: LoadByIdSurveyResultRepository
}

const makeSut = (): SutType => {
  const loadByIdSurveyResultRepository = makeLoadByIdSurveyResultRepositoryStub()
  const sut = new DbLoadByIdSurveyResult(loadByIdSurveyResultRepository)
  return {
    sut,
    loadByIdSurveyResultRepository
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
    const { sut, loadByIdSurveyResultRepository } = makeSut()
    const spyOn = jest.spyOn(loadByIdSurveyResultRepository, 'loadBySurveyId')
    await sut.loadBySurveyId('survey_id')
    expect(spyOn).toBeCalledWith('survey_id')
  })

  test('Should return a surveyResult with correct values', async () => {
    const { sut } = makeSut()
    const result = await sut.loadBySurveyId('survey_id')
    expect(result).toEqual(makeFakeSurveyResultModel())
  })

  test('Should throw if saveSurveyResultRepository.save throws', async () => {
    const { sut, loadByIdSurveyResultRepository } = makeSut()
    jest.spyOn(loadByIdSurveyResultRepository, 'loadBySurveyId').mockImplementationOnce(() => {
      throw new Error()
    })
    await expect(sut.loadBySurveyId('survey_id')).rejects.toThrow()
  })
})
