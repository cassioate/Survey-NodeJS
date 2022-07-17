import { AddSurvey, AddSurveyModel } from '../../../domain/usecases/survey/add-survey'
import { AddSurveyRepository } from '../../protocols/db/db-survey/add-survey-repository'

export class DbAddSurvey implements AddSurvey {
  private readonly addSurveyRepository: AddSurveyRepository

  constructor (addSurveyRepository: AddSurveyRepository) {
    this.addSurveyRepository = addSurveyRepository
  }

  async add (survey: AddSurveyModel): Promise<void> {
    await this.addSurveyRepository.add(survey)
  }
}
