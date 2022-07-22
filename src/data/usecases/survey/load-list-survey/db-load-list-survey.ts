import { SurveyModel } from '../../../../domain/models/survey'
import { LoadSurvey } from '../../../../domain/usecases/survey/load-survey'
import { LoadListSurveyRepository } from '../../../protocols/db/db-survey/load-survey-repository'

export class DbLoadListSurvey implements LoadSurvey {
  private readonly loadSurveyRepository: LoadListSurveyRepository

  constructor (loadSurveyRepository: LoadListSurveyRepository) {
    this.loadSurveyRepository = loadSurveyRepository
  }

  async loadListSurvey (): Promise<SurveyModel[]> {
    const listSurvey = await this.loadSurveyRepository.loadListSurvey()
    return listSurvey
  }
}
