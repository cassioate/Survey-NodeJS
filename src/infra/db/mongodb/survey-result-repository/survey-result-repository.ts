import { ObjectId } from 'mongodb'
import { SurveyResultModel } from '../../../../domain/models/survey-result'
import { SaveSurveyResult, SaveSurveyResultModel } from '../../../../domain/usecases/survey-result/save-survey-result'
import { MongoHelper } from '../helpers/mongo-helper'

export class SurveyResultMongoRepository implements SaveSurveyResult {
  async save (saveSurveyResult: SaveSurveyResultModel): Promise<SurveyResultModel> {
    const surveyResultoCollection = await MongoHelper.getCollection('surveyResults')
    const result = await surveyResultoCollection.findOneAndUpdate({
      surveyId: new ObjectId(saveSurveyResult.surveyId),
      accountId: new ObjectId(saveSurveyResult.accountId)
    }, {
      $set: {
        answer: saveSurveyResult.answer,
        date: saveSurveyResult.date
      }
    }, {
      upsert: true,
      returnDocument: 'after'
    })
    return result.value && MongoHelper.map(result.value)
  }
}
