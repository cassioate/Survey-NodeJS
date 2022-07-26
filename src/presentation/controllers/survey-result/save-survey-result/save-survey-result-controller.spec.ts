import { SurveyModel } from '../../../../domain/models/survey'
import { SurveyResultModel } from '../../../../domain/models/survey-result'
import { LoadSurveyById } from '../../../../domain/usecases/survey/load-survey-by-id'
import { InternalServerError, InvalidParamError } from '../../../errors'
import { HttpRequest } from '../../../protocols'
import { SaveSurveyResultController } from './save-survey-result-controller'
import { SaveSurveyResult, SaveSurveyResultModel } from '../../../../domain/usecases/survey-result/save-survey-result'
import MockDate from 'mockdate'
import { httpServerError } from '../../../helpers/http/http-helper'

const makeLoadSurveyRepositoryStub = (): LoadSurveyById => {
  class LoadSurveyRepositoryStub implements LoadSurveyById {
    async loadById (id: string): Promise<SurveyModel> {
      return makeFakeSurveyModel()
    }
  }
  return new LoadSurveyRepositoryStub()
}

const makeSaveSurveyResultRepositoryStub = (): SaveSurveyResult => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResult {
    async save (saveSurveyResult: SaveSurveyResultModel): Promise<SurveyResultModel> {
      return makeFakeSurveyResultModel()
    }
  }
  return new SaveSurveyResultRepositoryStub()
}

interface SutTypes {
  sut: SaveSurveyResultController
  loadSurveyRepositoryStub: LoadSurveyById
  saveSurveyResultoStub: SaveSurveyResult
}

const makeSut = (): SutTypes => {
  const loadSurveyRepositoryStub = makeLoadSurveyRepositoryStub()
  const saveSurveyResultoStub = makeSaveSurveyResultRepositoryStub()

  const sut = new SaveSurveyResultController(loadSurveyRepositoryStub, saveSurveyResultoStub)
  return {
    sut,
    loadSurveyRepositoryStub,
    saveSurveyResultoStub
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

const makeFakeSurveyResultModel = (): SurveyResultModel => {
  return {
    id: 'any_id',
    surveyId: 'survey_id',
    accountId: 'account_id',
    answer: 'answer',
    date: new Date()
  }
}

const makeFakeHttpRequest = (): HttpRequest => {
  return {
    params: {
      surveyId: 'any_id'
    },
    body: {
      answer: 'answer'
    },
    accountId: 'any_account_id'
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
    const httpRequest = makeFakeHttpRequest()
    await sut.handle(httpRequest)
    expect(spyOn).toBeCalledWith(httpRequest.params.surveyId)
  })

  test('Should save be called with correct values', async () => {
    const { sut, saveSurveyResultoStub } = makeSut()
    const spyOn = jest.spyOn(saveSurveyResultoStub, 'save')

    const httpRequest = makeFakeHttpRequest()
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
    const httpRequest = makeFakeHttpRequest()
    httpRequest.params.surveyId = 'id_not_exist_in_database'
    const result = await sut.handle(httpRequest)
    expect(result.statusCode).toEqual(403)
    expect(result.body.message).toEqual(new InvalidParamError('surveyId').message)
  })

  test('Should return 403 if answer in the request is not valid', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeHttpRequest()
    httpRequest.body.answer = 'answer_not_exist'
    const result = await sut.handle(httpRequest)
    expect(result.statusCode).toEqual(403)
    expect(result.body.message).toEqual(new InvalidParamError('answer not exist').message)
  })

  test('Should return 200 and return a surveyResult if all goes right', async () => {
    const { sut } = makeSut()
    const result = await sut.handle(makeFakeHttpRequest())
    expect(result.body).toEqual(makeFakeSurveyResultModel())
  })

  test('Should return internalServerError if any error was throw', async () => {
    const { sut, saveSurveyResultoStub } = makeSut()
    jest.spyOn(saveSurveyResultoStub, 'save').mockImplementationOnce(() => {
      throw new Error('error mocked')
    })
    const result = await sut.handle(makeFakeHttpRequest())
    expect(result.body.message).toEqual(httpServerError(new InternalServerError('stack')).body.message)
  })
})
