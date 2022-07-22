import { LoadSurvey } from '../../../../domain/usecases/survey/load-survey'
import { InternalServerError } from '../../../errors'
import { httpOk, httpServerError } from '../../../helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../../protocols'

export class LoadSurveyController implements Controller {
  private readonly loadSurvey: LoadSurvey

  constructor (loadSurvey: LoadSurvey) {
    this.loadSurvey = loadSurvey
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const find = await this.loadSurvey.loadListSurvey()
      return httpOk(find)
    } catch (error) {
      return httpServerError(new InternalServerError(error.stack))
    }
  }
}
