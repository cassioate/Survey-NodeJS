import { AddSurvey } from '../../../domain/usecases/survey/add-survey'
import { InternalServerError } from '../../errors'
import { httpBadRequest, httpServerError } from '../../helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse, Validation } from '../../protocols'

export class AddSurveyController implements Controller {
  private readonly validation: Validation
  private readonly addSurvey: AddSurvey

  constructor (validation: Validation, addSurvey: AddSurvey) {
    this.validation = validation
    this.addSurvey = addSurvey
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = await this.validation.validate(httpRequest.body)
      if (error) {
        return httpBadRequest(error)
      }
      await this.addSurvey.add(httpRequest.body)
      return null
    } catch (error) {
      return httpServerError(new InternalServerError(error.stack))
    }
  }
}
