import { EmailValidatorAdapter } from './email-validator-adapter'

describe('EmailValidator Adapter', () => {
  test('Should return false if validator returns false', async () => {
    const sut = new EmailValidatorAdapter()
    const isValid = await sut.isValid('invalid_email@email.com')
    expect(isValid).toBe(false)
  })
})

// describe('EmailValidator Adapter', () => {
//   test('Should return true if validator returns true', async () => {
//     const sut = new EmailValidatorAdapter()
//     const isValid = sut.isValid('valid_email@email.com')
//     expect(isValid).toBe(true)
//   })
// })
