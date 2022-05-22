import { InternalServerError, InvalidParamError, MissingParamError } from '../errors/index'
import { badRequestFuncHttpHelper, internalServerErrorFuncHttpHelper } from '../helpers/http-helper'
import { HttpRequest, HttpResponse, EmailValidator, Controller } from '../protocols'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator

  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequestFuncHttpHelper(new MissingParamError(field))
        }
      }
      const { email, password, passwordConfirmation } = httpRequest.body
      if (password !== passwordConfirmation) {
        return badRequestFuncHttpHelper(new InvalidParamError('passwordConfirmation'))
      }
      if (!this.emailValidator.isValid(email)) {
        return badRequestFuncHttpHelper(new InvalidParamError('email'))
      }
    } catch (error) {
      return internalServerErrorFuncHttpHelper(new InternalServerError())
    }
    return internalServerErrorFuncHttpHelper(Error())
  }
}
