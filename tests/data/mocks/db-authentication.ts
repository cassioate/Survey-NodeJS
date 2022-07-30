import { Decrypter } from '../../../src/data/protocols/criptography/decrypter'
import { Encrypter } from '../../../src/data/protocols/criptography/encrypter'
import { HashComparer } from '../../../src/data/protocols/criptography/hash-comparer'
import { Hasher } from '../../../src/data/protocols/criptography/hasher'
import { UpdateAccessTokenRepository } from '../../../src/data/protocols/db/db-account/update-access-token-repository'

export const makeHashComparerStub = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare (email: string): Promise<boolean> {
      return true
    }
  }
  return new HashComparerStub()
}

export const makeEncrypterStub = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (accountId: string): Promise<string> {
      return 'token_authenticated'
    }
  }
  return new EncrypterStub()
}

export const makeUpdateAccessTokenRepositoryStub = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async updateAccessToken (accountId: string, accessToken: string): Promise<void> {
    }
  }
  return new UpdateAccessTokenRepositoryStub()
}

export const makeHasherStub = (): Hasher => {
  class HasherStub implements Hasher {
    async hash (value: string): Promise<string> {
      return 'hashed_password'
    }
  }
  return new HasherStub()
}

export const makeDecrypterStub = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt (value: string): Promise<string> {
      return 'any_value'
    }
  }
  return new DecrypterStub()
}
