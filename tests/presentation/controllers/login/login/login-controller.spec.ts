import { Authentication } from '../../../../../src/domain/usecases/authentication/authentication'
import { MissingParamError, UnauthorizedError } from '../../../../../src/presentation/errors'
import { LoginController } from '../../../../../src/presentation/controllers/login/login/login-controller'
import { Validation } from '../../../../../src/presentation/protocols/validation'
import { httpBadRequest } from '../../../../../src/presentation/helpers/http/http-helper'
import { makeAuthenticationStub } from '../../../mocks/account-mocks-stub'
import { makeValidationStub } from '../../../../validation/mocks/validation-mocks'
import { makeFakeAuthenticationAccount, makeFakeAuthenticationRequest, makeFakeAuthenticationResponse } from '../../../../domain/models/mocks/mock-account'

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

describe('Login Controller', () => {
  test('Should throw if authentication auth throws', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(() => {
      throw new Error('Auth Throws')
    })
    const result = await sut.handle(makeFakeAuthenticationRequest())
    expect(result.body.message).toEqual('Internal Server Error')
    expect(result.statusCode).toBe(500)
  })

  test('Should return 401 account is not authorized', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(null)
    const result = await sut.handle(makeFakeAuthenticationRequest())
    expect(result.body.message).toEqual(new UnauthorizedError().message)
  })

  test('Should auth be called with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const spyOnAuth = jest.spyOn(authenticationStub, 'auth')
    await sut.handle(makeFakeAuthenticationRequest())
    expect(spyOnAuth).toBeCalledWith(makeFakeAuthenticationAccount())
  })

  test('Should return 200 and a correct access_token if account is authorized', async () => {
    const { sut } = makeSut()
    const result = await sut.handle(makeFakeAuthenticationRequest())
    expect(result).toEqual(makeFakeAuthenticationResponse())
  })

  test('Should call Validation with correct value', async () => {
    const { sut, validationStub } = makeSut()
    const spyOnValidate = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeAuthenticationRequest()
    await sut.handle(httpRequest)
    expect(spyOnValidate).toBeCalledWith(httpRequest.body)
  })

  test('Should return 400 if Validation reeturns a error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockImplementation(async () => {
      return new MissingParamError('any_field')
    })
    const result = await sut.handle(makeFakeAuthenticationRequest())
    expect(result.body.statusCode).toEqual(httpBadRequest(new MissingParamError('any_field')).body.statusCode)
    expect(result.body.message).toEqual(httpBadRequest(new MissingParamError('any_field')).body.message)
  })
})
