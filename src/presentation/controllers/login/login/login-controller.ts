import { Validation } from '../../../protocols/validation'
import { Authentication } from '../../../../domain/usecases/add-account/authentication'
import { InternalServerError } from '../../../errors'
import { httpBadRequest, httpOk, httpServerError, httpUnauthorized } from '../../../helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../signup/signup-protocols'

export class LoginController implements Controller {
  private readonly authentication: Authentication
  private readonly validation: Validation

  constructor (authentication: Authentication, validation: Validation) {
    this.authentication = authentication
    this.validation = validation
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = await this.validation.validate(httpRequest.body)
      if (error) {
        return httpBadRequest(error)
      }
      const { email, password } = httpRequest.body
      const accessToken = await this.authentication.auth({
        email,
        password
      })
      if (!accessToken) {
        return httpUnauthorized()
      }
      return httpOk({ accessToken })
    } catch (error) {
      return httpServerError(new InternalServerError(error.stack))
    }
  }
}
