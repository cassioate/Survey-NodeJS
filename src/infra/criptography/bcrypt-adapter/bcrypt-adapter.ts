import { Encrypter } from '../../../data/protocols/criptography/encrypter'
import bcrypt from 'bcrypt'
import { HashComparer } from '../../../data/protocols/criptography/hash-comparer'

export class BcryptAdapter implements Encrypter, HashComparer {
  async encrypt (value: string): Promise<string> {
    return bcrypt.hash(value, 12)
  }

  async compare (passwordAccount: string, passwordAuthentication: string): Promise<boolean> {
    const isValid = await bcrypt.compare(passwordAccount, passwordAuthentication)
    return isValid
  }
}
