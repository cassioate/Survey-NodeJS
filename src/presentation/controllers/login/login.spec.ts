import { Authentication } from '../../../domain/usecases/add-account/authentication'
import { MissingParamError, UnauthorizedError } from '../../../presentation/errors'
import { HttpRequest, HttpResponse } from '../signup/signup-protocols'
import { LoginController } from './login'
import { Validation } from '../../helpers/validators/interface/validation'
import { httpBadRequest } from '../../../presentation/helpers/http-helper'

const makeAuthenticationStub = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (email: string, password: string): Promise<string> {
      return 'any_token'
    }
  }
  return new AuthenticationStub()
}

const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    async validate (input: any): Promise<Error> {
      return null
    }
  }
  return new ValidationStub()
}

interface SutTypes {
  sut: LoginController
  authenticationStub: Authentication
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const authenticationStub = makeAuthenticationStub()
  const validationStub = makeValidationStub()
  const sut = new LoginController(authenticationStub, validationStub)
  return {
    sut,
    authenticationStub,
    validationStub
  }
}

const makeFakeRequest = (): HttpRequest => {
  return {
    body: {
      email: 'email@email.com',
      password: 'pass_valid'
    }
  }
}

const makeFakeResponse = (): HttpResponse => {
  return {
    statusCode: 200,
    body: {
      accessToken: 'any_token'
    }
  }
}

interface FakeCalledWith {
  email: string
  password: string
}
const makeFakeCalledWith = (): FakeCalledWith => {
  return {
    email: 'email@email.com',
    password: 'pass_valid'
  }
}

describe('Login Controller', () => {
  test('Should throw if authentication auth throws', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(() => {
      throw new Error('Auth Throws')
    })
    const result = await sut.handle(makeFakeRequest())
    expect(result.body.message).toEqual('Internal Server Error')
    expect(result.statusCode).toBe(500)
  })

  test('Should return 401 account is not authorized', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(null)
    const result = await sut.handle(makeFakeRequest())
    expect(result.body.message).toEqual(new UnauthorizedError().message)
  })

  test('Should auth be called with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const spyOnAuth = jest.spyOn(authenticationStub, 'auth')
    await sut.handle(makeFakeRequest())
    expect(spyOnAuth).toBeCalledWith(makeFakeCalledWith().email, makeFakeCalledWith().password)
  })

  test('Should return 200 and a correct access_token if account is authorized', async () => {
    const { sut } = makeSut()
    const result = await sut.handle(makeFakeRequest())
    expect(result).toEqual(makeFakeResponse())
  })

  test('Should call Validation with correct value', async () => {
    const { sut, validationStub } = makeSut()
    const spyOnValidate = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(spyOnValidate).toBeCalledWith(httpRequest.body)
  })

  test('Should return 400 if Validation reeturns a error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockImplementation(async () => {
      return new MissingParamError('any_field')
    })
    const result = await sut.handle(makeFakeRequest())
    expect(result.body.statusCode).toEqual(httpBadRequest(new MissingParamError('any_field')).body.statusCode)
    expect(result.body.message).toEqual(httpBadRequest(new MissingParamError('any_field')).body.message)
  })
})
