import { LoadSurveyById } from '../../../../domain/usecases/survey/load-survey-by-id'
import { SaveSurveyResult } from '../../../../domain/usecases/survey-result/save-survey-result'
import { InternalServerError, InvalidParamError } from '../../../errors'
import { httpForbidden, httpOk, httpServerError } from '../../../helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../../protocols'

export class SaveSurveyResultController implements Controller {
  private readonly loadSurveyById: LoadSurveyById
  private readonly saveSurveyResult: SaveSurveyResult

  constructor (loadSurveyById: LoadSurveyById, saveSurveyResult: SaveSurveyResult) {
    this.loadSurveyById = loadSurveyById
    this.saveSurveyResult = saveSurveyResult
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params
      const { answer } = httpRequest.body
      const { accountId } = httpRequest
      const survey = await this.loadSurveyById.loadById(surveyId)
      if (!survey) {
        return httpForbidden(new InvalidParamError('surveyId'))
      }
      const { answers } = survey
      const answerIsValid = answers.filter(filter => filter.answer === answer)
      if (answerIsValid.length === 0) {
        return httpForbidden(new InvalidParamError('answer not exist'))
      }
      const surveyResult = await this.saveSurveyResult.save(
        {
          surveyId,
          accountId,
          answer,
          date: new Date()
        }
      )
      return httpOk(surveyResult)
    } catch (error) {
      return httpServerError(new InternalServerError(error.stack))
    }
  }
}
