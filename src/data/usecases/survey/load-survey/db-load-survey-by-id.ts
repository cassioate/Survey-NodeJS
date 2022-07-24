import { SurveyModel } from '../../../../domain/models/survey'
import { LoadSurveyById } from '../../../../domain/usecases/survey/load-survey-by-id'
import { LoadSurveyByIdRepository } from '../../../protocols/db/db-survey/load-survey-by-id-repository'

export class DbLoadSurveyById implements LoadSurveyById {
  private readonly loadSurveyRepository: LoadSurveyByIdRepository

  constructor (loadSurveyRepository: LoadSurveyByIdRepository) {
    this.loadSurveyRepository = loadSurveyRepository
  }

  async loadById (id: string): Promise<SurveyModel> {
    const result = await this.loadSurveyRepository.loadById(id)
    return result
  }
}
