import { HashComparer } from '../../../../src/data/protocols/criptography/hash-comparer'
import { Encrypter } from '../../../../src/data/protocols/criptography/encrypter'
import { UpdateAccessTokenRepository } from '../../../../src/data/protocols/db/db-account/update-access-token-repository'
import { LoadAccountByEmailRepository } from '../../../../src/data/protocols/db/db-account/load-account-by-email-repository'
import { AccountModel } from '../../../../src/domain/models/account'
import { AuthenticationModel } from '../../../../src/domain/usecases/authentication/authentication'
import { DbAuthentication } from '../../../../src/data/usecases/authentication/db-authentication'

const makeFakeAccount = (): AccountModel => {
  return {
    id: 'any_id',
    name: 'any_name',
    email: 'any_email@email.com',
    password: 'any_password'
  }
}

const makeLoadAccountByEmailRepositoryStub = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail (email: string): Promise<AccountModel> {
      // return makeFakeAccount()
      return {
        ...makeFakeAccount(),
        password: 'hashed_password'
      }
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

const makeHashComparerStub = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare (email: string): Promise<boolean> {
      return true
    }
  }
  return new HashComparerStub()
}

const makeEncrypterStub = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (accountId: string): Promise<string> {
      return 'token_authenticated'
    }
  }
  return new EncrypterStub()
}

const makeUpdateAccessTokenRepositoryStub = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async updateAccessToken (accountId: string, accessToken: string): Promise<void> {
    }
  }
  return new UpdateAccessTokenRepositoryStub()
}

interface SutTypes {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashComparerStub: HashComparer
  encrypterStub: Encrypter
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepositoryStub()
  const hashComparerStub = makeHashComparerStub()
  const encrypterStub = makeEncrypterStub()
  const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepositoryStub()
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub, hashComparerStub, encrypterStub, updateAccessTokenRepositoryStub)
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub
  }
}

const makeFakeAuthentication = (): AuthenticationModel => {
  return {
    email: 'any_email@email.com',
    password: 'any_password'
  }
}

describe('DbAuthentication UserCase', () => {
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    await sut.auth(makeFakeAuthentication())
    expect(loadSpy).toHaveBeenCalledWith('any_email@email.com')
  })

  test('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockImplementation(() => {
      throw new Error('Error in loadAccountByEmailRepositoryStub')
    })
    const result = sut.auth(makeFakeAuthentication())
    await expect(result).rejects.toThrow('Error in loadAccountByEmailRepositoryStub')
  })

  test('Should returns null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(null)
    const result = await sut.auth(makeFakeAuthentication())
    expect(result).toBeNull()
  })

  test('Should call HashComparer with correct values', async () => {
    const { sut, hashComparerStub } = makeSut()
    const loadSpy = jest.spyOn(hashComparerStub, 'compare')
    await sut.auth(makeFakeAuthentication())
    expect(loadSpy).toHaveBeenCalledWith('any_password', 'hashed_password')
  })

  test('Should throw if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockImplementation(() => {
      throw new Error('Error in hashComparerStub')
    })
    const result = sut.auth(makeFakeAuthentication())
    await expect(result).rejects.toThrow('Error in hashComparerStub')
  })

  test('Should returns null if HashComparer is not valid', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockResolvedValueOnce(false)
    const result = await sut.auth(makeFakeAuthentication())
    expect(result).toBeNull()
  })

  test('Should call encrypter with correct values', async () => {
    const { sut, encrypterStub } = makeSut()
    const loadSpy = jest.spyOn(encrypterStub, 'encrypt')
    await sut.auth(makeFakeAuthentication())
    expect(loadSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should throw if encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockImplementation(() => {
      throw new Error('Error in encrypterStub')
    })
    const result = sut.auth(makeFakeAuthentication())
    await expect(result).rejects.toThrow('Error in encrypterStub')
  })

  test('Should returns null if encrypter returns null', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockResolvedValueOnce(null)
    const result = await sut.auth(makeFakeAuthentication())
    expect(result).toBeNull()
  })

  test('Should call updateAccessTokenRepositoryStub with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    const loadAccessToken = jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')
    await sut.auth(makeFakeAuthentication())
    expect(loadAccessToken).toHaveBeenCalledWith('any_id', 'token_authenticated')
  })

  test('Should throw if updateAccessTokenRepositoryStub throws', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken').mockImplementation(() => {
      throw new Error('Error in updateAccessTokenRepositoryStub')
    })
    const result = sut.auth(makeFakeAuthentication())
    await expect(result).rejects.toThrow('Error in updateAccessTokenRepositoryStub')
  })

  test('Should return a token valided', async () => {
    const { sut } = makeSut()
    const result = await sut.auth(makeFakeAuthentication())
    expect(result).toEqual('token_authenticated')
  })
})
