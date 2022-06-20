import { LogErrorRepository } from '@/data/protocols/log-error-repository'
import { MongoHelper } from '../helpers/mongo-helper'

export class LogErrorRepositoryMongo implements LogErrorRepository {
  async logError (stack: string): Promise<void> {
    const logCollection = await MongoHelper.getCollection('logErrors')
    await logCollection.insertOne({
      stack: stack,
      date: new Date()
    })
  }
}
