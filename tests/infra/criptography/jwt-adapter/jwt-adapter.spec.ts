import { Encrypter } from '../../../../src/data/protocols/criptography/encrypter'
import { JwtAdapter } from '../../../../src/infra/criptography/jwt-adapter/jwt-adapter'
import jwt from 'jsonwebtoken'

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return 'any_token'
  }
}))

const makeSut = (secret: string): Encrypter => {
  return new JwtAdapter(secret)
}

describe('Jwt Adapter', () => {
  test('Should call sign with correct values', async () => {
    const sut = makeSut('secret')
    const spyOnJwt = jest.spyOn(jwt, 'sign')
    await sut.encrypt('any_id')
    expect(spyOnJwt).toBeCalledWith({ id: 'any_id' }, 'secret')
  })

  test('Should throw if sign throws', async () => {
    const sut = makeSut('secret')
    jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
      throw new Error('jwt error')
    })
    const result = sut.encrypt('any_id')
    await expect(result).rejects.toThrow('jwt error')
  })

  test('Should return a token on sign success', async () => {
    const sut = makeSut('secret')
    const result = await sut.encrypt('any_id')
    expect(result).toEqual('any_token')
  })
})
