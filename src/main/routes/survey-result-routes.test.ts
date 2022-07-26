
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import request from 'supertest'
import app from '../config/app'
import env from '../config/env'
import { Collection } from 'mongodb'
import { AddSurveyModel } from '../../domain/usecases/survey/add-survey'
import { JwtAdapter } from '../../infra/criptography/jwt-adapter/jwt-adapter'
import { setUpRoles } from '../config/roles'
import { SurveyModel } from '../../domain/models/survey'

let surveyCollection: Collection
let accountCollection: Collection

const makeAccessToken = async (roleId: number, role: string): Promise<string> => {
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

const insertSurveyInDatabase = async (): Promise<void> => {
  await surveyCollection.insertOne(makeFakeSurveyModel())
}

const findSurveyInDatabase = async (): Promise<SurveyModel> => {
  const result = await surveyCollection.findOne({ question: 'question' })
  console.log(result)
  return result && MongoHelper.map(result)
}

const makeFakeSurveyModel = (): AddSurveyModel => {
  return {
    question: 'question',
    answers: [{
      image: 'image',
      answer: 'answer'
    }],
    date: new Date()
  }
}

const makeAnswer = (): any => {
  return {
    answer: 'answer'
  }
}

describe('Survey Result Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl)
    await setUpRoles()
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})

    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('POST /api/surveys/any_id/results', () => {
    test('Should survey add return 403 if user not has a token', async () => {
      await request(app)
        .put('/api/surveys/any_id/results')
        .send({})
        .expect(403)
    })

    test('Should survey-results return 200 on success', async () => {
      const accessToken = await makeAccessToken(1, 'admin')
      await insertSurveyInDatabase()
      const { id } = await findSurveyInDatabase()

      await request(app)
        .put(`/api/surveys/${id}/results`)
        .set('x-access-token', accessToken)
        .send(makeAnswer())
        .expect(200)
    })
  })
})
