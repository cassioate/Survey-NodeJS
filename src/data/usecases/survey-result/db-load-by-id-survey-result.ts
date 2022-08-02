import { SurveyResultModel } from '../../../domain/models/survey-result'
import { LoadSurveyResultById } from '../../../domain/usecases/survey-result/load-survey-result'
import { LoadByIdSurveyResultRepository } from '../../protocols/db/db-survey-result/load-by-id-survey-result-repository'

export class DbLoadByIdSurveyResult implements LoadSurveyResultById {
  private readonly loadByIdSurveyResultRepository: LoadByIdSurveyResultRepository

  constructor (loadByIdSurveyResultRepository: LoadByIdSurveyResultRepository) {
    this.loadByIdSurveyResultRepository = loadByIdSurveyResultRepository
  }

  async loadBySurveyId (surveyId: string): Promise<SurveyResultModel> {
    const result = await this.loadByIdSurveyResultRepository.loadBySurveyId(surveyId)
    return result
  }
}
