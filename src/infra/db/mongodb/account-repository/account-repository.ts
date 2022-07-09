import { LoadAccountByEmailRepository } from '../../../../data/protocols/db/db-account/load-account-by-email-repository'
import { UpdateAccessTokenRepository } from '../../../../data/protocols/db/db-account/update-access-token-repository'
import { ObjectId } from 'mongodb'
import { AddAccountRepository } from '../../../../data/protocols/db/db-account/add-account-repository'
import { AccountModel } from '../../../../domain/models/account'
import { AddAccountModel } from '../../../../domain/usecases/add-account/add-account'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(accountData)
    const resultFind = await accountCollection.findOne(result.insertedId)
    return MongoHelper.map(resultFind)
  }

  async loadByEmail (email: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({ email })
    return account && MongoHelper.map(account)
  }

  async updateAccessToken (accountId: string, accessToken: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.updateOne({ _id: new ObjectId(accountId) }, {
      $set: {
        accessToken: accessToken
      }
    })
  }
}
