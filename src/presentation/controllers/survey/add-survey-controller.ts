import { InternalServerError } from '../../errors'
import { httpBadRequest, httpServerError } from '../../helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse, Validation } from '../../protocols'

export class AddSurveyController implements Controller {
  private readonly validation: Validation

  constructor (validation: Validation) {
    this.validation = validation
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = await this.validation.validate(httpRequest.body)
      if (error) {
        return httpBadRequest(error)
      }
      return null
    } catch (error) {
      return httpServerError(new InternalServerError(error.stack))
    }
  }
}
