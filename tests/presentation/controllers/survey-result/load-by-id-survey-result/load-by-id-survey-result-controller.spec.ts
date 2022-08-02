import { LoadBySurveyIdResultController } from '../../../../../src/presentation/controllers/survey-result/load-by-id-survey-result/load-by-id-survey-result-controller'
import MockDate from 'mockdate'
import { LoadSurveyResultById } from '../../../../../src/domain/usecases/survey-result/load-survey-result'
import { makeLoadSurveyResultById } from '../../../mocks/survey-result-mocks-stub'
import { makeFakeLoadByIdSurveyResultHttpRequest, makeFakeSurveyResultModel } from '../../../../domain/models/mocks/mock-survey-result'
import { httpBadRequest, httpServerError } from '../../../../../src/presentation/helpers/http/http-helper'
import { InvalidParamError } from '../../../../../src/presentation/errors'
import { makeValidationStub } from '../../../../validation/mocks/validation-mocks'
import { Validation } from '../../../../../src/presentation/protocols'

interface SutTypes {
  sut: LoadBySurveyIdResultController
  loadSurveyResultById: LoadSurveyResultById
  validation: Validation
}

const makeSut = (): SutTypes => {
  const loadSurveyResultById = makeLoadSurveyResultById()
  const validation = makeValidationStub()

  const sut = new LoadBySurveyIdResultController(loadSurveyResultById)
  return {
    sut,
    loadSurveyResultById,
    validation
  }
}

describe('SaveSurveyResultController', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should loadSurveyById be called with correct values', async () => {
    const { sut, loadSurveyResultById } = makeSut()
    const spyOn = jest.spyOn(loadSurveyResultById, 'loadBySurveyId')
    await sut.handle(makeFakeLoadByIdSurveyResultHttpRequest())
    expect(spyOn).toBeCalledWith('survey_id')
  })

  test('Should loadSurveyById be called with correct values', async () => {
    const { sut } = makeSut()
    const result = await sut.handle(makeFakeLoadByIdSurveyResultHttpRequest())
    expect(result.body).toEqual(makeFakeSurveyResultModel())
  })

  test('Should loadSurveyById be called with correct values', async () => {
    const { sut, loadSurveyResultById } = makeSut()
    jest.spyOn(loadSurveyResultById, 'loadBySurveyId').mockImplementation(async () => {
      throw new Error()
    })
    const result = await sut.handle(makeFakeLoadByIdSurveyResultHttpRequest())
    expect(result.body.message).toEqual(httpServerError(new Error()).body.message)
  })

  test('Should have a wrong surveyId param in the httpRequest', async () => {
    const { sut, loadSurveyResultById } = makeSut()
    jest.spyOn(loadSurveyResultById, 'loadBySurveyId').mockImplementation(async () => {
      return null
    })
    const result = await sut.handle({
      params: {
        surveyId: 'survey_invalid_id'
      }
    })
    expect(result.body.message).toEqual(httpBadRequest(new InvalidParamError('surveyId')).body.message)
  })
})
