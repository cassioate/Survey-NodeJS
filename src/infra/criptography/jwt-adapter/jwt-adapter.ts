import jwt from 'jsonwebtoken'
import { Decrypter } from '../../../data/protocols/criptography/Decrypter'
import { Encrypter } from '../../../data/protocols/criptography/encrypter'

export class JwtAdapter implements Encrypter, Decrypter {
  private readonly secret: string

  constructor (secret: string) {
    this.secret = secret
  }

  async decrypt (token: string): Promise<string> {
    return jwt.verify(token, this.secret) as any
  }

  async encrypt (value: string): Promise<string> {
    return jwt.sign({ id: value }, this.secret)
  }
}
