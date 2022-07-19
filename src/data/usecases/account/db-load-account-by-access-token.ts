import { AccountModel } from '../../../domain/models/account'
import { LoadAccountByToken } from '../../../domain/usecases/account/load-account-by-access-token'
import { Decrypter } from '../../protocols/criptography/Decrypter'
import { LoadAccountByTokenRepository } from '../../protocols/db/db-account/load-account-by-token-repository'

export class DbLoadAccountByToken implements LoadAccountByToken {
  private readonly decrypter: Decrypter
  private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository

  constructor (decrypter: Decrypter, loadAccountByTokenRepository: LoadAccountByTokenRepository) {
    this.decrypter = decrypter
    this.loadAccountByTokenRepository = loadAccountByTokenRepository
  }

  async loadByToken (accessToken: string, role?: string): Promise<AccountModel> {
    const decryptedToken = await this.decrypter.decrypt(accessToken)
    console.log('decryptedTOKEN', decryptedToken)
    if (decryptedToken) {
      const account = await this.loadAccountByTokenRepository.loadByToken(accessToken, role)
      if (account) {
        return account
      }
    }

    return null
  }
}
