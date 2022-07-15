import { MissingParamError } from '../../errors'
import { Validation } from '../../protocols'
import { HttpRequest } from '../../protocols/http'
import { AddSurveyController } from './add-survey-controller'

const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    async validate (input: any): Promise<Error> {
      return null as unknown as Error
    }
  }
  return new ValidationStub()
}

interface SutTypes {
  sut: AddSurveyController
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidationStub()
  const sut = new AddSurveyController(validationStub)
  return {
    sut,
    validationStub
  }
}

const makeFakeHttpRequest = (): HttpRequest => {
  const httpRequest = {
    body: {
      question: 'any_question',
      answers: [{
        answer: 'any_name',
        image: 'any_answer'
      }]
    }
  }
  return httpRequest
}

describe('AddSurvey Controller', () => {
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

  // test('Should throw if Validation throws', async () => {
  //   const { sut, validationStub } = makeSut()
  //   jest.spyOn(validationStub, 'validate').mockImplementationOnce(async () => {
  //     throw new Error()
  //   })

  //   const httpRequest = makeFakeHttpRequest()
  //   const result = sut.handle(httpRequest)

  //   await expect(result).rejects.toThrow(httpRequest.body)
  // })
})
