import { SurveyModel } from '../../../../domain/models/survey'
import { LoadListSurvey } from '../../../../domain/usecases/survey/load-list-survey'
import { LoadListSurveyRepository } from '../../../protocols/db/db-survey/load-survey-repository'

export class DbLoadListSurvey implements LoadListSurvey {
  private readonly loadSurveyRepository: LoadListSurveyRepository

  constructor (loadSurveyRepository: LoadListSurveyRepository) {
    this.loadSurveyRepository = loadSurveyRepository
  }

  async loadListSurvey (): Promise<SurveyModel[]> {
    const listSurvey = await this.loadSurveyRepository.loadListSurvey()
    return listSurvey
  }
}
