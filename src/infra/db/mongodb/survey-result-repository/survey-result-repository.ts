import { ObjectId } from 'mongodb'
import { LoadByIdSurveyResultRepository } from '../../../../data/protocols/db/db-survey-result/load-by-id-survey-result-repository'
import { SaveSurveyResultRepository } from '../../../../data/protocols/db/db-survey-result/save-survey-result-repository'
import { SaveSurveyResultParams, SurveyResultModel } from '../../../../domain/models/survey-result'
import { MongoHelper } from '../helpers/mongo-helper'

export class SurveyResultMongoRepository implements SaveSurveyResultRepository, LoadByIdSurveyResultRepository {
  async save (saveSurveyResult: SaveSurveyResultParams): Promise<void> {
    const surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    await surveyResultCollection.findOneAndUpdate({
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
  }

  async loadBySurveyId (surveyId: string): Promise<SurveyResultModel> {
    const surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    const surveyCollection = await MongoHelper.getCollection('surveys')

    const takeAnswersBySurveyId = await surveyResultCollection.find({ surveyId: new ObjectId(surveyId) }).toArray()
    const takeSurvey = await surveyCollection.findOne({ _id: new ObjectId(surveyId) })
    if (!takeSurvey) {
      return null
    }
    const totalOfSurvey = takeAnswersBySurveyId.length

    const allAnswers = takeSurvey.answers.map(
      surveyAnswer => {
        const total = takeAnswersBySurveyId.filter(answersBySurveyId => answersBySurveyId.answer === surveyAnswer.answer).length
        return {
          image: surveyAnswer.image,
          answer: surveyAnswer.answer,
          count: total,
          percent: (total * 100 / totalOfSurvey) || 0
        }
      }
    )

    const returnSurveyResultModel: SurveyResultModel = {
      surveyId: surveyId,
      question: takeSurvey.question,
      answers: allAnswers,
      date: takeSurvey.date
    }
    return returnSurveyResultModel
  }
}
