import { HttpRequest } from '../../../../src/presentation/protocols'
import { AuthMiddleware } from '../../../../src/presentation/middlewares/auth/auth-middleware'
import { ForbiddenError } from '../../../../src/presentation/errors/forbidden-error'
import { LoadAccountByToken } from '../../../../src/domain/usecases/account/load-account-by-access-token'
import { AccountModel } from '../../../../src/domain/models/account'
import { httpServerError } from '../../../../src/presentation/helpers/http/http-helper'
import { InternalServerError } from '../../../../src/presentation/errors'

const makeFakeAccount = (): AccountModel => {
  return {
    id: 'any_id',
    name: 'any_name',
    email: 'any_email@email.com',
    password: 'any_password'
  }
}

const makeLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async loadByToken (accessToken: string): Promise<AccountModel> {
      return makeFakeAccount()
    }
  }
  return new LoadAccountByTokenStub()
}

const makeHttpRequest = (): HttpRequest => {
  return {
    headers: {
      'x-access-token': 'any_token'
    }
  }
}

interface SutTypes {
  sut: AuthMiddleware
  loadByTokenAccountByToken: LoadAccountByToken
}

const makeSut = (role?: string): SutTypes => {
  const loadByTokenAccountByToken = makeLoadAccountByToken()
  const sut = new AuthMiddleware(loadByTokenAccountByToken, role)
  return {
    sut,
    loadByTokenAccountByToken
  }
}

describe('Auth Middleware', () => {
  test('Should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut()
    const httpRequest = makeHttpRequest()
    httpRequest.headers['x-access-token'] = null
    const result = await sut.handle(httpRequest)
    expect(result.body.message).toEqual(new ForbiddenError().message)
  })

  test('Should return 403 if no header exist', async () => {
    const { sut } = makeSut()
    const httpRequest = makeHttpRequest()
    httpRequest.headers = null
    const result = await sut.handle(httpRequest)
    expect(result.body.message).toEqual(new ForbiddenError().message)
  })

  test('Should loadByToken be called with correct values', async () => {
    const role = 'any_role'
    const { sut, loadByTokenAccountByToken } = makeSut(role)
    const loadByTokenSpyOn = jest.spyOn(loadByTokenAccountByToken, 'loadByToken')
    const httpRequest = makeHttpRequest()
    await sut.handle(httpRequest)
    expect(loadByTokenSpyOn).toBeCalledWith('any_token', role)
  })

  test('Should return 403 if loadByToken return null', async () => {
    const { sut, loadByTokenAccountByToken } = makeSut()
    jest.spyOn(loadByTokenAccountByToken, 'loadByToken').mockImplementation(async () => {
      return null as unknown as AccountModel
    })
    const httpRequest = makeHttpRequest()
    const result = await sut.handle(httpRequest)
    expect(result.body.message).toEqual(new ForbiddenError().message)
  })

  test('Should return 200 if loadByToken return a accountId', async () => {
    const { sut } = makeSut()
    const httpRequest = makeHttpRequest()
    const result = await sut.handle(httpRequest)
    expect(result.body).toEqual({ accountId: 'any_id' })
  })

  test('Should return a server error if loadByTokenAccountByToken throws', async () => {
    const { sut, loadByTokenAccountByToken } = makeSut()
    jest.spyOn(loadByTokenAccountByToken, 'loadByToken').mockImplementation(async () => {
      throw new Error()
    })
    const httpRequest = makeHttpRequest()
    const result = await sut.handle(httpRequest)
    expect(result.body.message).toEqual(httpServerError(new InternalServerError('stack')).body.message)
  })
})
