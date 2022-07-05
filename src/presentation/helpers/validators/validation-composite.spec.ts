import { InvalidParamError } from '../../../presentation/errors'
import { Validation } from '../../protocols/validation'
import { ValidationComposite } from './validation-composite'

const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    async validate (input: any): Promise<Error> {
      return undefined
    }
  }
  return new ValidationStub()
}

interface SutType {
  sut: ValidationComposite
  validationStub: Validation
}

const makeSut = (): SutType => {
  const validationStub = makeValidationStub()
  const sut = new ValidationComposite([validationStub])
  return {
    sut,
    validationStub
  }
}

const fakeBody = {
  name: 'Cassio',
  email: 'cassio@gmail.com',
  password: '123456',
  passwordConfirmation: '123456'
}

describe('ValidationRequiredFields', () => {
  test('Should validate return undefined', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockImplementation(async () => {
      return new InvalidParamError('passwordConfirmation')
    })
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
