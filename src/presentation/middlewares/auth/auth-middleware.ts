import { LoadAccountByToken } from '../../../domain/usecases/account/load-account-by-access-token'
import { ForbiddenError } from '../../errors/forbidden-error'
import { httpForbidden, httpOk, httpServerError } from '../../helpers/http/http-helper'
import { HttpRequest, HttpResponse } from '../../protocols'
import { Middleware } from '../../protocols/middleware'

export class AuthMiddleware implements Middleware {
  private readonly loadAccountByToken: LoadAccountByToken
  private readonly role?: string

  constructor (loadAccountByToken: LoadAccountByToken, role?: string) {
    this.loadAccountByToken = loadAccountByToken
    this.role = role
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accessToken = httpRequest.headers?.['x-access-token']
      if (accessToken) {
        const account = await this.loadAccountByToken.loadByToken(accessToken, this.role)
        if (account) {
          return httpOk(account.id)
        }
      }
      return httpForbidden(new ForbiddenError())
    } catch (error) {
      return httpServerError(error)
    }
  }
}
