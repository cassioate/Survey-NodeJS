import { TokenGenerator } from '../../../data/protocols/criptography/token-generator'
import { JwtAdapter } from './jwt-adapter'
import jwt from 'jsonwebtoken'

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return 'any_token'
  }
}))

const makeSut = (secret: string): TokenGenerator => {
  return new JwtAdapter(secret)
}

describe('Jwt Adapter', () => {
  test('Should call sign with correct values', async () => {
    const sut = makeSut('secret')
    const spyOnJwt = jest.spyOn(jwt, 'sign')
    await sut.generate('any_id')
    expect(spyOnJwt).toBeCalledWith({ id: 'any_id' }, 'secret')
  })

  test('Should throw if sign throws', async () => {
    const sut = makeSut('secret')
    jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
      throw new Error('jwt error')
    })
    const result = sut.generate('any_id')
    await expect(result).rejects.toThrow('jwt error')
  })

  test('Should return a token on sign success', async () => {
    const sut = makeSut('secret')
    const result = await sut.generate('any_id')
    expect(result).toEqual('any_token')
  })
})
