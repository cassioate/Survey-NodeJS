import { AccountModel } from '../../../domain/models/account'
import { LoadAccountByToken } from '../../../domain/usecases/account/load-account-by-access-token'
import { Decrypter } from '../../protocols/criptography/Decrypter'
import { LoadAccountByTokenRepository } from '../../protocols/db/db-account/load-account-by-token-repository'
import { LoadRolesRepository } from '../../protocols/db/roles/load-roles-repository'

export class DbLoadAccountByToken implements LoadAccountByToken {
  private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  private readonly decrypter: Decrypter
  private readonly loadRoles: LoadRolesRepository
  constructor (decrypter: Decrypter, loadAccountByTokenRepository: LoadAccountByTokenRepository, loadRoles: LoadRolesRepository) {
    this.loadRoles = loadRoles
    this.decrypter = decrypter
    this.loadAccountByTokenRepository = loadAccountByTokenRepository
  }

  async loadByToken (accessToken: string, role?: string): Promise<AccountModel> {
    let decryptedToken: string
    try {
      decryptedToken = await this.decrypter.decrypt(accessToken)
    } catch (error) {
      return null
    }
    if (decryptedToken) {
      const account = await this.loadAccountByTokenRepository.loadByToken(accessToken, role)
      if (account) {
        const accountRole = await this.loadRoles.loadRole(account.role?.value)
        const roleValue = await this.loadRoles.loadRole(role)
        if (accountRole.id <= roleValue.id) {
          return account
        }
      }
    }
    return null
  }
}
