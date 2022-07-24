import { SurveyResultModel } from '../../../../domain/models/survey-result'
import { SaveSurveyResult, SaveSurveyResultModel } from '../../../../domain/usecases/survey/save-survey-result'
import { LoadSurveyByIdRepository } from '../../../protocols/db/db-survey/load-survey-by-id-repository'
import { SaveSurveyResultRepository } from '../../../protocols/db/db-survey/save-survey-result-repository'

export class DbSaveSurveyResult implements SaveSurveyResult {
  private readonly saveSurveyResultRepository: SaveSurveyResultRepository
  private readonly loadSurveyRepository: LoadSurveyByIdRepository

  constructor (saveSurveyResultRepository: SaveSurveyResultRepository, loadSurveyRepository: LoadSurveyByIdRepository) {
    this.saveSurveyResultRepository = saveSurveyResultRepository
    this.loadSurveyRepository = loadSurveyRepository
  }

  async save (saveSurveyResult: SaveSurveyResultModel): Promise<SurveyResultModel> {
    // const isValid = await this.loadSurveyRepository.loadById(saveSurveyResult.surveyId)
    const result = await this.saveSurveyResultRepository.save(saveSurveyResult)
    return result
  }
}
