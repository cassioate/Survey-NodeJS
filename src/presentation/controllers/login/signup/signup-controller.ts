import { Authentication } from '../../../../domain/usecases/authentication/authentication'
import { InternalServerError } from '../../../errors'
import { EmailInUseError } from '../../../errors/email-in-use-error'
import { httpBadRequest, httpForbidden, httpOk, httpServerError } from '../../../helpers/http/http-helper'
import { Controller, AddAccount, Validation, HttpRequest, HttpResponse } from './signup-protocols'

export class SignUpController implements Controller {
  private readonly addAccount: AddAccount
  private readonly validation: Validation
  private readonly authentication: Authentication

  constructor (addAccount: AddAccount, validation: Validation, authentication: Authentication) {
    this.addAccount = addAccount
    this.validation = validation
    this.authentication = authentication
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = await this.validation.validate(httpRequest.body)
      if (error) {
        return httpBadRequest(error)
      }
      const { name, email, password } = httpRequest.body
      const account = await this.addAccount.add({
        name,
        email,
        password
      })
      if (!account) {
        // Não concordo muito com a utilização do forbiden para um email já utilizado, mas vou usar ele por enquanto
        // talvez 409 ou 400 aqui seja melhor, mas ainda to pensando sobre, depois devo corrigir
        return httpForbidden(new EmailInUseError())
      }
      const accessToken = await this.authentication.auth({
        email,
        password
      })
      return httpOk({ accessToken })
    } catch (error) {
      return httpServerError(new InternalServerError(error.stack))
    }
  }
}
