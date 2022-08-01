import { ObjectId } from 'mongodb'
import { AddSurveyRepository } from '../../../../data/protocols/db/db-survey/add-survey-repository'
import { LoadSurveyByIdRepository } from '../../../../data/protocols/db/db-survey/load-survey-by-id-repository'
import { LoadListSurveyRepository } from '../../../../data/protocols/db/db-survey/load-survey-repository'
import { AddSurveyParams, SurveyModel } from '../../../../domain/models/survey'
import { MongoHelper } from '../helpers/mongo-helper'

export class SurveyMongoRepository implements AddSurveyRepository, LoadListSurveyRepository, LoadSurveyByIdRepository {
  async add (surveyData: AddSurveyParams): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(surveyData)
  }

  async loadListSurvey (): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const listSurvey = await surveyCollection.find({}).toArray()
    return listSurvey && MongoHelper.mapList(listSurvey)
  }

  async loadById (id: string): Promise<SurveyModel> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const survey = await surveyCollection.findOne({ _id: new ObjectId(id) })
    return survey && MongoHelper.map(survey)
  }
}
