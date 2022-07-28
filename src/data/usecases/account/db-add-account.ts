import { AccountModel, AddAccountParams } from '../../../domain/models/account'
import { AddAccount } from '../../../domain/usecases/account/add-account'
import { AddAccountRepository } from '../../protocols/db/db-account/add-account-repository'
import { LoadAccountByEmailRepository } from '../../protocols/db/db-account/load-account-by-email-repository'
import { Hasher } from '../../protocols/criptography/hasher'

export class DbAddAccount implements AddAccount {
  private readonly hasher: Hasher
  private readonly addAccountRepository: AddAccountRepository
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository

  constructor (hasher: Hasher, addAccountRepository: AddAccountRepository,
    loadAccountByEmailRepository: LoadAccountByEmailRepository) {
    this.hasher = hasher
    this.addAccountRepository = addAccountRepository
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
  }

  async add (account: AddAccountParams): Promise<AccountModel> {
    const passCrypt = await this.hasher.hash(account.password)
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
