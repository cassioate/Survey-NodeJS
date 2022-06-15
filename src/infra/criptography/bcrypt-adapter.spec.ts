import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

interface SutTypes {
  sut: BcryptAdapter
}

const makeSut = (): SutTypes => {
  const sut = new BcryptAdapter()
  return {
    sut
  }
}

describe('Bcrypt Adapter', () => {
  test('Should call the bcrypt with the corrects values', async () => {
    const { sut } = makeSut()
    const spyOnBcrypt = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('password')
    expect(spyOnBcrypt).toBeCalledWith('password', 12)
  })

  test('Should return the value encrypted', async () => {
    const { sut } = makeSut()
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
      return 'hashed_password'
    })
    const result = await sut.encrypt('password')
    expect(result).toEqual('hashed_password')
  })

  test('Should throw if bcrypt hash throws', async () => {
    const { sut } = makeSut()
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
      throw new Error('bcrypt hash throw')
    })
    const result = sut.encrypt('password')
    await expect(result).rejects.toThrow('bcrypt hash throw')
  })
})
