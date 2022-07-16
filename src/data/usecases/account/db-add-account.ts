import { AccountModel } from '../../../domain/models/account'
import { AddAccount, AddAccountModel } from '../../../domain/usecases/account/add-account'
import { AddAccountRepository } from '../../protocols/db/db-account/add-account-repository'
import { Encrypter } from '../../protocols/criptography/encrypter'
import { LoadAccountByEmailRepository } from '../../protocols/db/db-account/load-account-by-email-repository'

export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter
  private readonly addAccountRepository: AddAccountRepository
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository

  constructor (encrypter: Encrypter, addAccountRepository: AddAccountRepository,
    loadAccountByEmailRepository: LoadAccountByEmailRepository) {
    this.encrypter = encrypter
    this.addAccountRepository = addAccountRepository
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
  }

  async add (account: AddAccountModel): Promise<AccountModel> {
    const passCrypt = await this.encrypter.encrypt(account.password)
    const accountWithHashedPassword = {
      ...account,
      password: passCrypt
    }
    const hasEmail = await this.loadAccountByEmailRepository.loadByEmail(account.email)
    if (hasEmail) {
      return null
    }
    return this.addAccountRepository.add(accountWithHashedPassword)
  }
}
