import { MissingParamError } from '../../presentation/errors'
import { ValidationRequiredFields } from './validation-required-field'

const fakeBody = {
  name: 'Cassio',
  email: 'cassio@gmail.com',
  password: '123456',
  passwordConfirmation: '123456'
}

describe('ValidationRequiredFields', () => {
  test('Should return MissingParamError if no name is provided', async () => {
    const sut = new ValidationRequiredFields('name')
    const newFakeBody = { ...fakeBody }
    newFakeBody.name = null as unknown as string
    const result = await sut.validate(newFakeBody)
    expect(result.message).toEqual(new MissingParamError('name').message)
  })

  test('Should return undefined if all fields are corrected passed', async () => {
    const sut = new ValidationRequiredFields('passwordConfirmation')
    const result = await sut.validate(fakeBody)
    expect(result).toEqual(undefined)
  })
})
