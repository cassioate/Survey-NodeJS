import { AddSurveyRepository } from '../../../../data/protocols/db/db-survey/add-survey-repository'
import { LoadListSurveyRepository } from '../../../../data/protocols/db/db-survey/load-survey-repository'
import { SurveyModel } from '../../../../domain/models/survey'
import { AddSurveyModel } from '../../../../domain/usecases/survey/add-survey'
import { MongoHelper } from '../helpers/mongo-helper'

export class SurveyMongoRepository implements AddSurveyRepository, LoadListSurveyRepository {
  async add (surveyData: AddSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(surveyData)
  }

  async loadListSurvey (): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const listSurvey = await surveyCollection.find({}).toArray()
    return MongoHelper.mapList(listSurvey)
  }
}
