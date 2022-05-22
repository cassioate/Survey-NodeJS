import { InternalServerError, InvalidParamError, MissingParamError } from '../../errors/index'
import { badRequestFuncHttpHelper, internalServerErrorFuncHttpHelper, successFuncHttpHelper } from '../../helpers/http-helper'
import { HttpRequest, HttpResponse, EmailValidator, Controller, AddAccount } from './signup-protocols'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount

  constructor (emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequestFuncHttpHelper(new MissingParamError(field))
        }
      }
      const { name, email, password, passwordConfirmation } = httpRequest.body
      if (password !== passwordConfirmation) {
        return badRequestFuncHttpHelper(new InvalidParamError('passwordConfirmation'))
      }
      if (!this.emailValidator.isValid(email)) {
        return badRequestFuncHttpHelper(new InvalidParamError('email'))
      }
      const account = this.addAccount.add({
        name,
        email,
        password
      })
      return successFuncHttpHelper(account)
    } catch (error) {
      return internalServerErrorFuncHttpHelper(new InternalServerError())
    }
  }
}
