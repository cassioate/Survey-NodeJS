import { AccountModel } from '../../../domain/models/account'
import { Roles } from '../../../domain/models/roles'
import { Decrypter } from '../../protocols/criptography/Decrypter'
import { LoadAccountByTokenRepository } from '../../protocols/db/db-account/load-account-by-token-repository'
import { LoadRolesRepository } from '../../protocols/db/roles/load-roles-repository'
import { DbLoadAccountByToken } from './db-load-account-by-access-token'

const makeFakeAccount = (): AccountModel => {
  return {
    id: 'any_id',
    name: 'any_name',
    email: 'any_email@email.com',
    password: 'any_password',
    role: {
      id: 1,
      value: 'admin'
    }
  }
}

const makeLoadRolesRepositorySut = (): LoadRolesRepository => {
  class LoadRolesRepositoryStub implements LoadRolesRepository {
    async loadRole (role: string): Promise<Roles> {
      return {
        id: 1,
        value: 'admin'
      }
    }
  }
  return new LoadRolesRepositoryStub()
}

const makeDecrypterSut = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt (value: string): Promise<string> {
      return 'any_value'
    }
  }
  return new DecrypterStub()
}

const makeLoadAccountByTokenRepository = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
    async loadByToken (token: string, role?: string | undefined): Promise<AccountModel> {
      return makeFakeAccount()
    }
  }
  return new LoadAccountByTokenRepositoryStub()
}

interface SutTypes {
  sut: DbLoadAccountByToken
  decrypterStub: Decrypter
  loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository
  loadRolesRepositoryStub: LoadRolesRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByTokenRepositoryStub = makeLoadAccountByTokenRepository()
  const decrypterStub = makeDecrypterSut()
  const loadRolesRepositoryStub = makeLoadRolesRepositorySut()
  const sut = new DbLoadAccountByToken(decrypterStub, loadAccountByTokenRepositoryStub, loadRolesRepositoryStub)
  return {
    sut,
    decrypterStub,
    loadAccountByTokenRepositoryStub,
    loadRolesRepositoryStub
  }
}

describe('LoadAccountByAccessToken', () => {
  test('Should call descrypter.decrypt() with correct values', async () => {
    const { sut, decrypterStub } = makeSut()
    const spyOn = jest.spyOn(decrypterStub, 'decrypt')
    await sut.loadByToken('any_token')
    expect(spyOn).toBeCalledWith('any_token')
  })

  test('Should throw if descrypter.decrypt() throws', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockImplementation(() => {
      throw new Error('decrypt throws')
    })
    const result = await sut.loadByToken('any_token')
    expect(result).toEqual(null)
  })

  test('Should call loadByToken() with correct values', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    const spyOn = jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
    await sut.loadByToken('any_token', 'any_role')
    expect(spyOn).toBeCalledWith('any_token', 'any_role')
  })

  test('Should throw if loadByToken() throws', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken').mockImplementation(() => {
      throw new Error('decrypt throws')
    })
    await expect(sut.loadByToken('any_token', 'any_role')).rejects.toThrow('decrypt throws')
  })

  test('Should return a account if all goes right', async () => {
    const { sut } = makeSut()
    const result = await sut.loadByToken('any_token', 'any_role')
    expect(result).toEqual(makeFakeAccount())
  })

  test('Should return null if account', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken').mockImplementationOnce(async () => {
      const account = makeFakeAccount()
      account.role = undefined
      return account
    })
    const result = await sut.loadByToken('any_token', 'any_role')
    expect(result).toEqual(null)
  })

  test('Should return null if the account no exist in database', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken').mockImplementation(async () => {
      return null as unknown as AccountModel
    })
    const result = await sut.loadByToken('any_token', 'any_role')
    expect(result).toEqual(null)
  })

  test('Should return null if the token is not valid', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockImplementation(async () => {
      return null as unknown as string
    })
    const result = await sut.loadByToken('any_token', 'any_role')
    expect(result).toEqual(null)
  })
})
