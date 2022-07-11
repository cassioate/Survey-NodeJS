import { AccountModel } from '../../../domain/models/account'
import { AddAccount, AddAccountModel } from '../../../domain/usecases/add-account/add-account'
import { AddAccountRepository } from '../../protocols/db/db-account/add-account-repository'
import { Encrypter } from '../../protocols/criptography/encrypter'
import { DbAddAccount } from './db-add-account'
import { LoadAccountByEmailRepository } from '../../protocols/db/db-account/load-account-by-email-repository'

const makeEncrypterSut = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return 'hashed_password'
    }
  }
  return new EncrypterStub()
}

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (value: AddAccountModel): Promise<AccountModel> {
      const account = {
        id: 'id_valid',
        ...value
      }
      return account
    }
  }
  return new AddAccountRepositoryStub()
}

const makeLoadAccountByEmailRepositoryStub = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail (email: string): Promise<AccountModel> {
      return null as unknown as AccountModel
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

const makeFakeAccount = (): AccountModel => {
  return {
    id: 'any_id',
    name: 'any_name',
    email: 'any_email@email.com',
    password: 'any_password'
  }
}

interface SutTypes {
  sut: AddAccount
  encrypterStub: Encrypter
  addAccountRepositoryStub: AddAccountRepository
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypterSut()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepositoryStub()
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub, loadAccountByEmailRepositoryStub)
  return {
    sut,
    encrypterStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub
  }
}

const makeFakeAddAccountModel = (): AddAccountModel => {
  const accountData = {
    name: 'valid_name',
    email: 'valid_email',
    password: 'valid_password'
  }
  return accountData
}

const makeFakeAddAccountModelWithPasswordHashed = (): AddAccountModel => {
  const accountData = {
    name: 'valid_name',
    email: 'valid_email',
    password: 'hashed_password'
  }
  return accountData
}

describe('DbAddAccount Usecase', () => {
  test('Should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    await sut.add(makeFakeAddAccountModel())
    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })

  test('Should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockImplementation(() => {
      throw new Error('Encrypter throws')
    })
    const sutResult = sut.add(makeFakeAddAccountModel())
    await expect(sutResult).rejects.toThrow('Encrypter throws')
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    await sut.add(makeFakeAddAccountModel())
    expect(addSpy).toHaveBeenCalledWith(makeFakeAddAccountModelWithPasswordHashed())
  })

  test('Should throw if addAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add').mockImplementation(() => {
      throw new Error('addAccountRepositoryStub throws')
    })
    const sutResult = sut.add(makeFakeAddAccountModel())
    await expect(sutResult).rejects.toThrow('addAccountRepositoryStub throws')
  })

  test('Should return an account on success', async () => {
    const { sut } = makeSut()
    const sutResult = await sut.add(makeFakeAddAccountModel())
    expect(sutResult).toEqual({
      id: 'id_valid',
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password'
    })
  })

  test('Should throw if loadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockImplementation(() => {
      throw new Error('loadAccountByEmailRepositoryStub throws')
    })
    const sutResult = sut.add(makeFakeAddAccountModel())
    await expect(sutResult).rejects.toThrow('loadAccountByEmailRepositoryStub throws')
  })

  test('Should call loadAccountByEmailRepository with correct values', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadByEmailSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    await sut.add(makeFakeAddAccountModel())
    expect(loadByEmailSpy).toHaveBeenCalledWith(makeFakeAddAccountModel().email)
  })

  test('Should loadAccountByEmailRepository.loadByEmail return null if email is already in use', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockImplementation(async () => {
      return makeFakeAccount()
    })
    const sutResult = await sut.add(makeFakeAddAccountModel())
    expect(sutResult).toBe(null)
  })
})
