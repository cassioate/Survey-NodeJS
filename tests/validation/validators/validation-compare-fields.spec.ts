import { InvalidParamError } from '../../../src/presentation/errors'
import { ValidationCompareFields } from '../../../src/validation/validators/validation-compare-fields'

interface SutType {
  sut: ValidationCompareFields
}

const makeSut = (): SutType => {
  const sut = new ValidationCompareFields('password', 'passwordConfirmation')
  return {
    sut
  }
}

const fakeBody = {
  name: 'Cassio',
  email: 'cassio@gmail.com',
  password: '123456',
  passwordConfirmation: '123456'
}

describe('ValidationRequiredFields', () => {
  test('Should validate return InvalidParamError', async () => {
    const { sut } = makeSut()
    const newFakeBody = { ...fakeBody }
    newFakeBody.passwordConfirmation = 'invalid_password'
    const result = await sut.validate(newFakeBody)
    expect(result).toEqual(new InvalidParamError('passwordConfirmation'))
  })

  test('Should validate return undefined', async () => {
    const { sut } = makeSut()
    const result = await sut.validate(fakeBody)
    expect(result).toBe(undefined)
  })
})
