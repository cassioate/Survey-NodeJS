import { Validation } from '../../protocols/validation'
import { InternalServerError } from '../../errors/index'
import { httpBadRequest, httpOk, httpServerError } from '../../helpers/http/http-helper'
import { HttpRequest, HttpResponse, Controller, AddAccount } from './signup-protocols'

export class SignUpController implements Controller {
  private readonly addAccount: AddAccount
  private readonly validation: Validation

  constructor (addAccount: AddAccount, validation: Validation) {
    this.addAccount = addAccount
    this.validation = validation
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
      return httpOk(account)
    } catch (error) {
      return httpServerError(new InternalServerError(error.stack))
    }
  }
}
