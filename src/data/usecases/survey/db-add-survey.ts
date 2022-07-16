import { SurveyModel } from '../../../domain/models/survey'
import { AddSurvey, AddSurveyModel } from '../../../domain/usecases/survey/add-survey'
import { AddSurveyRepository } from '../../protocols/db/db-survey/add-account-repository'

export class DbAddSurvey implements AddSurvey {
  private readonly addSurveyRepository: AddSurveyRepository

  constructor (addSurveyRepository: AddSurveyRepository) {
    this.addSurveyRepository = addSurveyRepository
  }

  async add (survey: AddSurveyModel): Promise<SurveyModel> {
    return await this.addSurveyRepository.add(survey)
  }
}
