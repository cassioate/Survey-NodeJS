
import { MongoHelper } from '../../../../../src/infra/db/mongodb/helpers/mongo-helper'
import { AccountMongoRepository } from '../../../../../src/infra/db/mongodb/account-repository/account-repository'
import env from '../../../../../src/main/config/env'
import { Collection } from 'mongodb'

let accountCollection: Collection

describe('Account Repository MongoDB', () => {
  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('AddAccount', () => {
    test('Should return an account on add success', async () => {
      const sut = new AccountMongoRepository()
      const result = await sut.add({
        name: 'any_name',
        email: 'any_email',
        password: 'any_password'
      })

      expect(result).toBeTruthy()
      expect(result.id).toBeTruthy()
      expect(result.name).toBe('any_name')
      expect(result.email).toBe('any_email')
      expect(result.password).toBe('any_password')
    })
  })

  describe('LoadByEmail', () => {
    test('Should return an account on loadByEmail success', async () => {
      const sut = new AccountMongoRepository()
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email',
        password: 'any_password'
      })

      const result = await sut.loadByEmail('any_email')
      expect(result).toBeTruthy()
      expect(result.id).toBeTruthy()
      expect(result.name).toBe('any_name')
      expect(result.email).toBe('any_email')
      expect(result.password).toBe('any_password')
    })

    test('Should return null if loadByEmail fails', async () => {
      const sut = new AccountMongoRepository()
      const result = await sut.loadByEmail('any_email')
      expect(result).toBeFalsy()
    })
  })

  describe('UpdateAccessToken', () => {
    test('Should update accessToken in one account when updateAccessToken has success', async () => {
      const sut = new AccountMongoRepository()
      const account = await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email',
        password: 'any_password'
      })

      const accountInDatabase = await accountCollection.findOne({ _id: account.insertedId })
      expect(accountInDatabase.accessToken).toBeFalsy()

      await sut.updateAccessToken(account.insertedId.toString(), 'any_token')
      const accountInDatabaseAfterUpdate = await accountCollection.findOne({ _id: account.insertedId })

      expect(accountInDatabaseAfterUpdate).toBeTruthy()
      expect(accountInDatabaseAfterUpdate.accessToken).toEqual('any_token')
    })
  })

  describe('LoadByToken', () => {
    test('Should return an account on loadByToken success', async () => {
      const sut = new AccountMongoRepository()
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email',
        password: 'any_password',
        accessToken: 'any_token'
      })

      const result = await sut.loadByToken('any_token')
      expect(result).toBeTruthy()
      expect(result.id).toBeTruthy()
      expect(result.name).toBe('any_name')
      expect(result.email).toBe('any_email')
      expect(result.password).toBe('any_password')
    })

    test('Should return null if loadByToken fails', async () => {
      const sut = new AccountMongoRepository()
      const result = await sut.loadByToken('any_token')
      expect(result).toBeFalsy()
    })
  })
})
