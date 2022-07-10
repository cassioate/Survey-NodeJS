import { TokenGenerator } from '../../../data/protocols/criptography/token-generator'
import jwt from 'jsonwebtoken'

export class JwtAdapter implements TokenGenerator {
  private readonly secret: string

  constructor (secret: string) {
    this.secret = secret
  }

  async generate (value: string): Promise<string> {
    const accessToken = jwt.sign({ id: value }, this.secret)
    return accessToken
  }
}
