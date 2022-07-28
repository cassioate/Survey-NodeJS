import { AccountModel, AddAccountParams, AuthenticationParams } from '../../../../src/domain/models/account'
import { HttpRequest, HttpResponse } from '../../../../src/presentation/protocols'

export const makeFakeAddAccountHttpRequest = (): HttpRequest => {
  return {
    headers: {
      'x-access-token': 'any_token'
    },
    body: makeFakeAddAccountParamsWithPassConfirmation()
  }
}

export const makeFakeAuthenticationRequest = (): HttpRequest => {
  return {
    body: makeFakeAuthenticationAccount()
  }
}

export const makeFakeAuthenticationResponse = (): HttpResponse => {
  return {
    statusCode: 200,
    body: {
      accessToken: 'any_token'
    }
  }
}

export const makeFakeAccount = (): AccountModel => {
  return {
    id: 'any_id',
    name: 'any_name',
    email: 'any_email@email.com',
    password: 'any_password'
  }
}

export const makeFakeAuthenticationAccount = (): AuthenticationParams => {
  return {
    email: 'any_email@email.com',
    password: 'any_password'
  }
}

export const makeFakeAddAccountParams = (): AddAccountParams => {
  return {
    name: 'any_name',
    email: 'any_email@email.com',
    password: 'any_password'
  }
}

export const makeFakeAddAccountParamsWithPassConfirmation = (): any => {
  return {
    ...makeFakeAddAccountParams(),
    passwordConfirmation: 'any_password'
  }
}
