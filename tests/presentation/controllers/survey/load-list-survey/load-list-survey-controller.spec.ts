
import { LoadListSurveyController } from '../../../../../src/presentation/controllers/survey/load-list-survey/load-list-survey-controller'
import MockDate from 'mockdate'
import { LoadListSurvey } from '../../../../../src/domain/usecases/survey/load-list-survey'
import { InternalServerError } from '../../../../../src/presentation/errors'
import { makeLoadSurveyStub } from '../../../mocks/survey-mocks-stub'
import { makeFakeListSurvey } from '../../../../domain/models/mocks/mock-survey'

interface SutTypes {
  sut: LoadListSurveyController
  loadSurveyStub: LoadListSurvey
}

const makeSut = (): SutTypes => {
  const loadSurveyStub = makeLoadSurveyStub()
  const sut = new LoadListSurveyController(loadSurveyStub)
  return {
    sut,
    loadSurveyStub
  }
}

describe('LoadSurvey Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call the loadListSurvey', async () => {
    const { sut, loadSurveyStub } = makeSut()
    const spyOnLoad = jest.spyOn(loadSurveyStub, 'loadListSurvey')
    await sut.handle({})
    expect(spyOnLoad).toBeCalled()
  })

  test('Should return 200 with correct values if all goes right', async () => {
    const { sut } = makeSut()
    const listSurvey = makeFakeListSurvey()

    const result = await sut.handle({})
    expect(result.body).toEqual(listSurvey)
  })

  test('Should return 204 statusCode if array is empty', async () => {
    const { sut, loadSurveyStub } = makeSut()
    jest.spyOn(loadSurveyStub, 'loadListSurvey').mockImplementationOnce(async () => {
      return []
    })

    const result = await sut.handle({})
    expect(result.statusCode).toEqual(204)
  })

  test('Should reeturn internalServerError if loadListSurvey throws', async () => {
    const { sut, loadSurveyStub } = makeSut()
    jest.spyOn(loadSurveyStub, 'loadListSurvey').mockImplementationOnce(() => {
      throw new Error('Error loadListSurvey')
    })

    const result = await sut.handle({})
    expect(result.body.message).toEqual(new InternalServerError('').message)
  })
})
