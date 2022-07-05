import { httpBadRequest } from '../../helpers/http/http-helper'
import { Validation } from '../../protocols/validation'
import { InternalServerError, MissingParamError } from '../../errors'
import { SignUpController } from './signup-controller'
import { AccountModel, AddAccount, AddAccountModel, HttpRequest } from './signup-protocols'

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      return makeFakeAccount()
    }
  }
  return new AddAccountStub()
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    async validate (input: any): Promise<Error> {
      return null
    }
  }
  return new ValidationStub()
}

interface SutTypes {
  sut: SignUpController
  addAccountStub: AddAccount
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const addAccountStub = makeAddAccount()
  const validationStub = makeValidation()
  const sut = new SignUpController(addAccountStub, validationStub)
  return {
    sut,
    addAccountStub,
    validationStub
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

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeHttpRequest())
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual(makeFakeAccount())
  })
})
