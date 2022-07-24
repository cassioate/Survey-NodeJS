import { LoadListSurvey } from '../../../../domain/usecases/survey/load-list-survey'
import { InternalServerError } from '../../../errors'
import { httpNoContent, httpOk, httpServerError } from '../../../helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../../protocols'

export class LoadListSurveyController implements Controller {
  private readonly loadSurvey: LoadListSurvey

  constructor (loadSurvey: LoadListSurvey) {
    this.loadSurvey = loadSurvey
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const find = await this.loadSurvey.loadListSurvey()
      return find.length ? httpOk(find) : httpNoContent()
    } catch (error) {
      return httpServerError(new InternalServerError(error.stack))
    }
  }
}
