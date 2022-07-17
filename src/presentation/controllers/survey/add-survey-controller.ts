import { AddSurvey } from '../../../domain/usecases/survey/add-survey'
import { InternalServerError } from '../../errors'
import { httpBadRequest, httpNoContent, httpServerError } from '../../helpers/http/http-helper'
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
      // console.log(httpRequest.body)
      const error = await this.validation.validate(httpRequest.body)
      if (error) {
        return httpBadRequest(error)
      }
      const { question, answers } = httpRequest.body
      await this.addSurvey.add({
        question,
        answers
      })
      return httpNoContent()
    } catch (error) {
      return httpServerError(new InternalServerError(error.stack))
    }
  }
}
