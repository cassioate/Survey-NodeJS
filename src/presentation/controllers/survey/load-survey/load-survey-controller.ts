import { LoadSurvey } from '../../../../domain/usecases/survey/load-survey'
import { InternalServerError } from '../../../errors'
import { httpNoContent, httpOk, httpServerError } from '../../../helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../../protocols'

export class LoadSurveyController implements Controller {
  private readonly loadSurvey: LoadSurvey

  constructor (loadSurvey: LoadSurvey) {
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
