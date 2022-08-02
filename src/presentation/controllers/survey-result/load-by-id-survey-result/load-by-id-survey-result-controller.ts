import { Controller, HttpRequest, HttpResponse } from '../../../protocols'
import { httpBadRequest, httpOk, httpServerError } from '../../../helpers/http/http-helper'
import { LoadSurveyResultById } from '../../../../domain/usecases/survey-result/load-survey-result'
import { InvalidParamError } from '../../../errors'

export class LoadBySurveyIdResultController implements Controller {
  private readonly loadSurveyResultById: LoadSurveyResultById

  constructor (loadSurveyResultById: LoadSurveyResultById) {
    this.loadSurveyResultById = loadSurveyResultById
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params
      const result = await this.loadSurveyResultById.loadBySurveyId(surveyId)
      if (!result) {
        return httpBadRequest(new InvalidParamError('surveyId'))
      }
      return httpOk(result)
    } catch (error) {
      return httpServerError(error)
    }
  }
}
