import { ObjectId } from 'mongodb'
import { SaveSurveyResultParams, SurveyResultModel, AnswerSurveyResultModel } from '../../../../domain/models/survey-result'
import { SaveSurveyResult } from '../../../../domain/usecases/survey-result/save-survey-result'
import { MongoHelper } from '../helpers/mongo-helper'

export class SurveyResultMongoRepository implements SaveSurveyResult {
  async save (saveSurveyResult: SaveSurveyResultParams): Promise<SurveyResultModel> {
    const surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    const result = await surveyResultCollection.findOneAndUpdate({
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

    const findBySurveyId = await surveyResultCollection.find({ surveyId: result.value.surveyId }).toArray()
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const findSurvey = await surveyCollection.findOne({ _id: result.value.surveyId })

    const totalOfSurvey = findBySurveyId.length
    const totalOfAnswers: AnswerSurveyResultModel[] = []

    findSurvey.answers.forEach(
      answerInFindSurvey => {
        const total = findBySurveyId.filter(surveyResult => surveyResult.answer === answerInFindSurvey.answer).length
        totalOfAnswers.push({
          image: answerInFindSurvey.image,
          answer: answerInFindSurvey.answer,
          count: total,
          percent: total * 100 / totalOfSurvey
        })
      }
    )

    const returnSurveyResultModel: SurveyResultModel = {
      surveyId: result.value.surveyId,
      question: findSurvey.question,
      answers: totalOfAnswers,
      date: result.value.date
    }

    return returnSurveyResultModel
  }
}
