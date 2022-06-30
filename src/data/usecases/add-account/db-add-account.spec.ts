import { AccountModel } from '../../../domain/models/account'
import { AddAccount, AddAccountModel } from '../../../domain/usecases/add-account/add-account'
import { AddAccountRepository } from '../../protocols/db/add-account-repository'
import { Encrypter } from '../../protocols/criptography/encrypter'
import { DbAddAccount } from './db-add-account'

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
interface SutTypes {
  sut: AddAccount
  encrypterStub: Encrypter
  addAccountRepositoryStub: AddAccountRepository
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypterSut()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub)
  return {
    sut,
    encrypterStub,
    addAccountRepositoryStub
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
})
