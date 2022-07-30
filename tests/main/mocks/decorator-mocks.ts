import { LogErrorRepository } from '../../../src/data/protocols/db/db-log/log-error-repository'
import { Controller, HttpRequest, HttpResponse } from '../../../src/presentation/protocols'

export const makeFakeHttpRequest = (): HttpRequest => {
  const httpRequest = {
    body: {
      name: 'valid_name',
      email: 'valid_email'
    }
  }
  return httpRequest
}

export const makeFakeHttpResponse = (): HttpResponse => {
  const response = {
    statusCode: 200,
    body: {
      name: 'valid_name'
    }
  }
  return response
}

export const makeControllerStub = (): Controller => {
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

export const makeLogRepositoryStub = (): LogErrorRepository => {
  class LogRepositoryStub implements LogErrorRepository {
    async logError (stack: string): Promise<void> {
      return null
    }
  }
  return new LogRepositoryStub()
}
