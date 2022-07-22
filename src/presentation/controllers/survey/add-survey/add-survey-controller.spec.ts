import { InternalServerError, MissingParamError } from '../../../errors'
import { Validation } from '../../../protocols'
import { HttpRequest } from '../../../protocols/http'
import { AddSurveyController } from './add-survey-controller'
import { AddSurvey } from '../../../../domain/usecases/survey/add-survey'
import { httpNoContent } from '../../../helpers/http/http-helper'
import MockDate from 'mockdate'

const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    async validate (input: any): Promise<Error> {
      return null as unknown as Error
    }
  }
  return new ValidationStub()
}

const makeAddSurveyStub = (): AddSurvey => {
  class DbAddSurveyStub implements AddSurvey {
    async add (survey: any): Promise<void> {
    }
  }
  return new DbAddSurveyStub()
}

interface SutTypes {
  sut: AddSurveyController
  validationStub: Validation
  addSurveyStub: AddSurvey
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidationStub()
  const addSurveyStub = makeAddSurveyStub()
  const sut = new AddSurveyController(validationStub, addSurveyStub)
  return {
    sut,
    validationStub,
    addSurveyStub
  }
}

const makeFakeHttpRequest = (): HttpRequest => {
  const httpRequest = {
    body: {
      question: 'any_question',
      answers: [{
        answer: 'any_name',
        image: 'any_answer'
      }],
      date: new Date()
    }
  }
  return httpRequest
}

describe('AddSurvey Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const spyOnValidate = jest.spyOn(validationStub, 'validate')

    const httpRequest = makeFakeHttpRequest()
    await sut.handle(httpRequest)

    expect(spyOnValidate).toBeCalledWith(httpRequest.body)
  })

  test('Should return badRequest if Validation fails', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockImplementationOnce(async () => {
      return new MissingParamError('question')
    })

    const httpRequest = makeFakeHttpRequest()
    const result = await sut.handle(httpRequest)

    expect(result.statusCode).toEqual(400)
    expect(result.body.message).toEqual(new MissingParamError('question').message)
  })

  test('Should call method add in addSurvey with correct values', async () => {
    const { sut, addSurveyStub } = makeSut()
    const SpyOnAdd = jest.spyOn(addSurveyStub, 'add')

    const httpRequest = makeFakeHttpRequest()
    await sut.handle(httpRequest)

    expect(SpyOnAdd).toBeCalledWith(httpRequest.body)
  })

  test('Should return a internal error if any error be throw in handle method', async () => {
    const { sut, addSurveyStub } = makeSut()
    jest.spyOn(addSurveyStub, 'add').mockImplementationOnce(async () => {
      throw new InternalServerError('stack')
    })

    const httpRequest = makeFakeHttpRequest()
    const result = await sut.handle(httpRequest)

    expect(result.statusCode).toEqual(500)
    expect(result.body.message).toEqual(new InternalServerError('stack').message)
  })

  test('Should return a MissingParamError error if answers is not one array', async () => {
    const { sut } = makeSut()

    const newFakeBody = {
      body: {
        question: 'who is more beautiful?',
        answers: {
          answer: null,
          image: 'testeImage'
        }
      }
    }

    const result = await sut.handle(newFakeBody)
    expect(result.body.message).toEqual(new MissingParamError('answers need to be array').message)
  })

  test('Should return 204 statusCode if all goes ok with the handle method', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeHttpRequest()
    const result = await sut.handle(httpRequest)
    expect(result.statusCode).toEqual(204)
    expect(result).toEqual(httpNoContent())
  })
})
