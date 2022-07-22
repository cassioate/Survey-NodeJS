import { AddSurvey } from '../../../domain/usecases/survey/add-survey'
import { InternalServerError, MissingParamError } from '../../errors'
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
      const error = await this.validation.validate(httpRequest.body)
      if (error) {
        return httpBadRequest(error)
      }

      // Need to do this, because has no validation in the httpRequest body,
      // so if i not do this, i can received answers with any field inside, and that should not happen.
      // ------
      if (!Array.isArray(httpRequest.body.answers)) {
        return httpBadRequest(new MissingParamError('answers need to be array'))
      }

      const { question } = httpRequest.body
      await this.addSurvey.add({
        question,
        answers: httpRequest.body.answers.map(answer => {
          return {
            image: answer.image,
            answer: answer.answer
          }
        }),
        date: new Date()
      })

      return httpNoContent()
    } catch (error) {
      return httpServerError(new InternalServerError(error.stack))
    }
  }
}
