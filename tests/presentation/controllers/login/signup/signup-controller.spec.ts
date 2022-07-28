import { Authentication, AuthenticationModel } from '../../../../../src/domain/usecases/authentication/authentication'
import { InternalServerError, MissingParamError } from '../../../../../src/presentation/errors'
import { AccountModel, AddAccount, AddAccountParams, HttpRequest } from '../../../../../src/presentation/controllers/login/signup/signup-protocols'
import { Validation } from '../../../../../src/presentation/protocols/validation'
import { httpBadRequest } from '../../../../../src/presentation/helpers/http/http-helper'
import { SignUpController } from '../../../../../src/presentation/controllers/login/signup/signup-controller'
import { EmailInUseError } from '../../../../../src/presentation/errors/email-in-use-error'

const makeAuthenticationStub = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (authentication: AuthenticationModel): Promise<string> {
      return 'any_token'
    }
  }
  return new AuthenticationStub()
}

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountParams): Promise<AccountModel> {
      return makeFakeAccount()
    }
  }
  return new AddAccountStub()
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    async validate (input: any): Promise<Error> {
      return null as unknown as Error
    }
  }
  return new ValidationStub()
}

interface SutTypes {
  sut: SignUpController
  addAccountStub: AddAccount
  validationStub: Validation
  authenticationStub: Authentication
}

const makeSut = (): SutTypes => {
  const addAccountStub = makeAddAccount()
  const validationStub = makeValidation()
  const authenticationStub = makeAuthenticationStub()
  const sut = new SignUpController(addAccountStub, validationStub, authenticationStub)
  return {
    sut,
    addAccountStub,
    validationStub,
    authenticationStub
  }
}

const makeFakeAccount = (): AccountModel => {
  const response = {
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email@mail.com',
    password: 'valid_password'
  }
  return response
}

const makeFakeHttpRequest = (): HttpRequest => {
  const httpRequest = {
    body: {
      name: 'valid_name',
      email: 'valid_email@email.com',
      password: 'valid_password',
      passwordConfirmation: 'valid_password'
    }
  }
  return httpRequest
}

describe('SignUp Controller', () => {
  test('Should throw any_error if validations throws', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockImplementation(async () => {
      return new MissingParamError('any_field')
    })
    const result = await sut.handle(makeFakeHttpRequest())
    expect(result.body.message).toEqual(httpBadRequest(new MissingParamError('any_field')).body.message)
  })

  test('Should return 500 if addAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementation(async () => {
      return new Promise((resolve, reject) => reject(new Error()))
    })
    const httpResponse = await sut.handle(makeFakeHttpRequest())
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body.message).toEqual(new InternalServerError('stack_InternalServerError').message)
  })

  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    await sut.handle(makeFakeHttpRequest())
    expect(addSpy).toBeCalledWith({
      name: 'valid_name',
      email: 'valid_email@email.com',
      password: 'valid_password'
    })
  })

  test('Should return 403 forbidden if email is already in use', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return null as unknown as AccountModel
    })
    const result = await sut.handle(makeFakeHttpRequest())
    expect(result.statusCode).toBe(403)
    expect(result.body.message).toEqual(new EmailInUseError().message)
  })

  test('Should call authentication.auth with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const addSpy = jest.spyOn(authenticationStub, 'auth')
    await sut.handle(makeFakeHttpRequest())
    expect(addSpy).toBeCalledWith({
      email: 'valid_email@email.com',
      password: 'valid_password'
    })
  })

  test('Should return a token if all goes ok in authentication', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockImplementation(async () => {
      return 'token'
    })
    const httpResponse = await sut.handle(makeFakeHttpRequest())
    expect(httpResponse.body.accessToken).toEqual('token')
  })

  test('Should return a error if authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockImplementation(async () => {
      throw new Error('authentication error')
    })
    const httpResponse = await sut.handle(makeFakeHttpRequest())
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body.message).toEqual(new InternalServerError('stack_InternalServerError').message)
  })

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeHttpRequest())
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body.accessToken).toBeTruthy()
  })
})
