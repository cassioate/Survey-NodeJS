import { SurveyResultModel } from '../../../domain/models/survey-result'
import { SaveSurveyResult, SaveSurveyResultModel } from '../../../domain/usecases/survey-result/save-survey-result'
import { SaveSurveyResultRepository } from '../../protocols/db/db-survey-result/save-survey-result-repository'

export class DbSaveSurveyResult implements SaveSurveyResult {
  private readonly saveSurveyResultRepository: SaveSurveyResultRepository

  constructor (saveSurveyResultRepository: SaveSurveyResultRepository) {
    this.saveSurveyResultRepository = saveSurveyResultRepository
  }

  async save (saveSurveyResult: SaveSurveyResultModel): Promise<SurveyResultModel> {
    const result = await this.saveSurveyResultRepository.save(saveSurveyResult)
    return result
  }
}
