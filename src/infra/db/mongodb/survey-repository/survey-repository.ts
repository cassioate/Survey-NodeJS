import { AddSurveyRepository } from '../../../../data/protocols/db/db-survey/add-account-repository'
import { SurveyModel } from '../../../../domain/models/survey'
import { AddSurveyModel } from '../../../../domain/usecases/survey/add-survey'
import { MongoHelper } from '../helpers/mongo-helper'

export class SurveyMongoRepository implements AddSurveyRepository {
  async add (surveyData: AddSurveyModel): Promise<SurveyModel> {
    const surveyCollection = await MongoHelper.getCollection('survey')
    const result = await surveyCollection.insertOne(surveyData)
    const resultFind = await surveyCollection.findOne(result.insertedId)
    return MongoHelper.map(resultFind)
  }
}
