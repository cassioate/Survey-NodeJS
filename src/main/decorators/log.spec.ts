import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { LogControllerDecorator } from './log'

interface SutTypes{
  sut: LogControllerDecorator
  controllerStub: Controller
}

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

const makeSut = (): SutTypes => {
  const controllerStub = makeControllerStub()
  const sut = new LogControllerDecorator(controllerStub)
  return {
    sut,
    controllerStub
  }
}

describe('Log Decorator', () => {
  test('Should called controller with the correct request', async () => {
    const { sut, controllerStub } = makeSut()
    const spyOnControllerStub = jest.spyOn(controllerStub, 'handle')

    const httpRequest = {
      body: {
        name: 'valid_name',
        email: 'valid_email'
      }
    }

    await sut.handle(httpRequest)
    expect(spyOnControllerStub).toBeCalledWith(httpRequest)
  })

  test('Should throws if controllerStub throws', async () => {
    const { sut, controllerStub } = makeSut()
    jest.spyOn(controllerStub, 'handle').mockImplementation(() => {
      throw new Error('Controller Error')
    })

    const httpRequest = {
      body: {
        name: 'valid_name',
        email: 'valid_email'
      }
    }

    const result = sut.handle(httpRequest)
    await expect(result).rejects.toThrow()
  })

  test('Should return the expected response', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'valid_name',
        email: 'valid_email'
      }
    }

    const response = {
      statusCode: 200,
      body: {
        name: 'valid_name'
      }
    }

    const result = await sut.handle(httpRequest)
    expect(result).toEqual(response)
  })
})
