import { Collection } from 'mongodb'
import { SurveyModel } from '../../../src/domain/models/survey'
import { JwtAdapter } from '../../../src/infra/criptography/jwt-adapter/jwt-adapter'
import { MongoHelper } from '../../../src/infra/db/mongodb/helpers/mongo-helper'
import env from '../../../src/main/config/env'
import { makeFakeSurveyModelParam } from '../../domain/models/mocks/mock-survey'

export const makeAccessToken = async (accountCollection: Collection, roleId: number, role: string): Promise<string> => {
  const account = await accountCollection.insertOne({
    name: 'any_name',
    email: 'any_email',
    password: 'any_password',
    role: {
      id: roleId,
      value: role
    }
  })

  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const accessToken = await jwtAdapter.encrypt(account.insertedId.toString())

  await accountCollection.updateOne({
    _id: account.insertedId
  }, {
    $set: {
      accessToken
    }
  })

  return accessToken
}

export const insertSurveyInDatabase = async (surveyCollection: Collection): Promise<void> => {
  await surveyCollection.insertOne(makeFakeSurveyModelParam())
}

export const findSurveyInDatabase = async (surveyCollection: Collection): Promise<SurveyModel> => {
  const result = await surveyCollection.findOne({ question: 'question' })
  console.log(result)
  return result && MongoHelper.map(result)
}

export const makeAnswer = (): any => {
  return {
    answer: 'answer'
  }
}
