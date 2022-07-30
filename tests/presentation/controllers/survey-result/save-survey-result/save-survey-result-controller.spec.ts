import { SurveyModel } from '../../../../../src/domain/models/survey'
import { LoadSurveyById } from '../../../../../src/domain/usecases/survey/load-survey-by-id'
import { InternalServerError, InvalidParamError } from '../../../../../src/presentation/errors'
import { SaveSurveyResultController } from '../../../../../src/presentation/controllers/survey-result/save-survey-result/save-survey-result-controller'
import { SaveSurveyResult } from '../../../../../src/domain/usecases/survey-result/save-survey-result'
import MockDate from 'mockdate'
import { httpServerError } from '../../../../../src/presentation/helpers/http/http-helper'
// import { makeLoadSurveyRepositoryStub, makeSaveSurveyResultRepositoryStub } from '../../../mocks/survey-result-mocks-stub'
import { makeFakeSurveyResultHttpRequest, makeFakeSurveyResultModel } from '../../../../domain/models/mocks/mock-survey-result'
import { makeLoadSurveyByIdStub, makeSaveSurveyResultStub } from '../../../mocks/survey-result-mocks-stub'

interface SutTypes {
  sut: SaveSurveyResultController
  loadSurveyRepositoryStub: LoadSurveyById
  saveSurveyResultoStub: SaveSurveyResult
}

const makeSut = (): SutTypes => {
  const loadSurveyRepositoryStub = makeLoadSurveyByIdStub()
  const saveSurveyResultoStub = makeSaveSurveyResultStub()

  const sut = new SaveSurveyResultController(loadSurveyRepositoryStub, saveSurveyResultoStub)
  return {
    sut,
    loadSurveyRepositoryStub,
    saveSurveyResultoStub
  }
}

describe('SaveSurveyResultController', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should loadyById be called with correct values', async () => {
    const { sut, loadSurveyRepositoryStub } = makeSut()
    const spyOn = jest.spyOn(loadSurveyRepositoryStub, 'loadById')
    const httpRequest = makeFakeSurveyResultHttpRequest()
    await sut.handle(httpRequest)
    expect(spyOn).toBeCalledWith(httpRequest.params.surveyId)
  })

  test('Should save be called with correct values', async () => {
    const { sut, saveSurveyResultoStub } = makeSut()
    const spyOn = jest.spyOn(saveSurveyResultoStub, 'save')

    const httpRequest = makeFakeSurveyResultHttpRequest()
    const { surveyId } = httpRequest.params
    const { answer } = httpRequest.body
    const { accountId } = httpRequest
    await sut.handle(httpRequest)

    expect(spyOn).toBeCalledWith({
      surveyId,
      accountId,
      answer,
      date: new Date()
    })
  })

  test('Should return 403 if surveyId is not valid', async () => {
    const { sut, loadSurveyRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyRepositoryStub, 'loadById').mockImplementationOnce(async () => {
      return null as unknown as SurveyModel
    })
    const httpRequest = makeFakeSurveyResultHttpRequest()
    httpRequest.params.surveyId = 'id_not_exist_in_database'
    const result = await sut.handle(httpRequest)
    expect(result.statusCode).toEqual(403)
    expect(result.body.message).toEqual(new InvalidParamError('surveyId').message)
  })

  test('Should return 403 if answer in the request is not valid', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeSurveyResultHttpRequest()
    httpRequest.body.answer = 'answer_not_exist'
    const result = await sut.handle(httpRequest)
    expect(result.statusCode).toEqual(403)
    expect(result.body.message).toEqual(new InvalidParamError('answer not exist').message)
  })

  test('Should return 200 and return a surveyResult if all goes right', async () => {
    const { sut } = makeSut()
    const result = await sut.handle(makeFakeSurveyResultHttpRequest())
    expect(result.body).toEqual(makeFakeSurveyResultModel())
  })

  test('Should return internalServerError if any error was throw', async () => {
    const { sut, saveSurveyResultoStub } = makeSut()
    jest.spyOn(saveSurveyResultoStub, 'save').mockImplementationOnce(() => {
      throw new Error('error mocked')
    })
    const result = await sut.handle(makeFakeSurveyResultHttpRequest())
    expect(result.body.message).toEqual(httpServerError(new InternalServerError('stack')).body.message)
  })
})
