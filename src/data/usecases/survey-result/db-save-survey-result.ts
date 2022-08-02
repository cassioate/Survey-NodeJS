import { SaveSurveyResultParams, SurveyResultModel } from '../../../domain/models/survey-result'
import { SaveSurveyResult } from '../../../domain/usecases/survey-result/save-survey-result'
import { LoadByIdSurveyResultRepository } from '../../protocols/db/db-survey-result/load-by-id-survey-result-repository'
import { SaveSurveyResultRepository } from '../../protocols/db/db-survey-result/save-survey-result-repository'

export class DbSaveSurveyResult implements SaveSurveyResult {
  private readonly saveSurveyResultRepository: SaveSurveyResultRepository
  private readonly loadByIdSurveyResultRepository: LoadByIdSurveyResultRepository

  constructor (saveSurveyResultRepository: SaveSurveyResultRepository, loadByIdSurveyResultRepository: LoadByIdSurveyResultRepository) {
    this.saveSurveyResultRepository = saveSurveyResultRepository
    this.loadByIdSurveyResultRepository = loadByIdSurveyResultRepository
  }

  async save (saveSurveyResult: SaveSurveyResultParams): Promise<SurveyResultModel> {
    await this.saveSurveyResultRepository.save(saveSurveyResult)
    const result = this.loadByIdSurveyResultRepository.loadBySurveyId(saveSurveyResult.surveyId)
    return result
  }
}
