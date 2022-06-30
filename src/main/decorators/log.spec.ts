import { LogErrorRepository } from '../../data/protocols/db/log-error-repository'
import { InternalServerError } from '../../presentation/errors/index'
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'
import { httpServerError } from '../../presentation/helpers/http/http-helper'

const makeControllerStub = (): Controller => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      const response = {
        statusCode: 200,
        body: {
          name: 'valid_name'
        }
      }
      return response
    }
  }
  return new ControllerStub()
}

const makeLogRepositoryStub = (): LogErrorRepository => {
  class LogRepositoryStub implements LogErrorRepository {
    async logError (stack: string): Promise<void> {
      return null
    }
  }
  return new LogRepositoryStub()
}

interface SutTypes{
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
}

const makeSut = (): SutTypes => {
  const controllerStub = makeControllerStub()
  const logErrorRepositoryStub = makeLogRepositoryStub()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)
  return {
    sut,
    controllerStub,
    logErrorRepositoryStub
  }
}

const makeFakeHttpRequest = (): HttpRequest => {
  const httpRequest = {
    body: {
      name: 'valid_name',
      email: 'valid_email'
    }
  }
  return httpRequest
}

const makeFakeHttpResponse = (): HttpResponse => {
  const response = {
    statusCode: 200,
    body: {
      name: 'valid_name'
    }
  }
  return response
}

describe('Log Decorator', () => {
  test('Should called controller with the correct request', async () => {
    const { sut, controllerStub } = makeSut()
    const spyOnControllerStub = jest.spyOn(controllerStub, 'handle')
    await sut.handle(makeFakeHttpRequest())
    expect(spyOnControllerStub).toBeCalledWith(makeFakeHttpRequest())
  })

  test('Should throws if controllerStub throws', async () => {
    const { sut, controllerStub } = makeSut()
    jest.spyOn(controllerStub, 'handle').mockImplementation(() => {
      throw new Error('Controller Error')
    })
    const result = sut.handle(makeFakeHttpRequest())
    await expect(result).rejects.toThrow()
  })

  test('Should return the expected response', async () => {
    const { sut } = makeSut()
    const result = await sut.handle(makeFakeHttpRequest())
    expect(result).toEqual(makeFakeHttpResponse())
  })

  test('Should return a stackError from teh error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
    const fakeError = new Error()
    fakeError.stack = 'any_stack_error'
    const internalError = httpServerError(new InternalServerError(fakeError.stack))
    jest.spyOn(controllerStub, 'handle').mockImplementationOnce(async () => {
      return internalError
    })
    const spyOnLogErrorRepositoryStub = jest.spyOn(logErrorRepositoryStub, 'logError')
    await sut.handle(makeFakeHttpRequest())
    expect(spyOnLogErrorRepositoryStub).toHaveBeenCalledWith('any_stack_error')
  })
})
