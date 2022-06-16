import { Collection, MongoClient } from 'mongodb'

export const MongoHelper = {
  // Aqui eu defino que as variaveis do objeto tem o valor null e o tipo delas são MongoClient/string,
  // pois essa é a unica forma de fazer isso dentro de uma const
  client: null as MongoClient,
  uri: null as string,

  async connect (uri: string): Promise<void> {
    this.uri = uri
    this.client = await MongoClient.connect(uri)
  },

  async disconnect (): Promise<void> {
    await this.client.close()
    this.client = null
  },

  getCollection (name: string): Collection {
    return this.client.db().collection(name)
  },

  map (collection: any): any {
    const { _id, ...rest } = collection
    return {
      id: _id,
      ...rest
    }
  }
}

// ESSA SERIA A FORMA DE FAZER VIA CLASSES

// export class MongoHelper {
//   private static client: MongoClient;
//   private static uri: string;

//   static async connect (uri: string): Promise<void> {
//     this.uri = uri
//     this.client = await MongoClient.connect(uri)
//   }

//   static async disconnect (): Promise<void> {
//     await this.client.close()
//     this.client = null
//   }

//   static getCollection (name: string): Collection {
//     return this.client.db().collection(name)
//   }
// }
