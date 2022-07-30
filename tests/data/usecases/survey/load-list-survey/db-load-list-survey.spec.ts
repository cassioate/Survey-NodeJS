import { LoadListSurveyRepository } from '../../../../../src/data/protocols/db/db-survey/load-survey-repository'
import { DbLoadListSurvey } from '../../../../../src/data/usecases/survey/load-list-survey/db-load-list-survey'
import MockDate from 'mockdate'
import { makeLoadListSurveyRepositoryStub } from '../../../mocks/db-survey-mock'
import { makeFakeListSurvey } from '../../../../domain/models/mocks/mock-survey'

interface SutTypes {
  sut: DbLoadListSurvey
  loadListSurveyRepositoryStub: LoadListSurveyRepository
}

const makeSut = (): SutTypes => {
  const loadListSurveyRepositoryStub = makeLoadListSurveyRepositoryStub()
  const sut = new DbLoadListSurvey(loadListSurveyRepositoryStub)
  return {
    sut,
    loadListSurveyRepositoryStub
  }
}

describe('LoadListSurvey', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })
  test('Should return a list of survey', async () => {
    const { sut } = makeSut()
    const result = await sut.loadListSurvey()
    expect(result).toEqual(makeFakeListSurvey())
  })

  test('Should call loadListSurveyRepository with correct values', async () => {
    const { sut, loadListSurveyRepositoryStub } = makeSut()
    const spyOnLoadList = jest.spyOn(loadListSurveyRepositoryStub, 'loadListSurvey')
    await sut.loadListSurvey()
    expect(spyOnLoadList).toBeCalled()
  })

  test('Should throw if loadListSurveyRepository throws', async () => {
    const { sut, loadListSurveyRepositoryStub } = makeSut()
    jest.spyOn(loadListSurveyRepositoryStub, 'loadListSurvey').mockImplementationOnce(() => {
      throw new Error()
    })
    await expect(sut.loadListSurvey()).rejects.toThrow()
  })
})
