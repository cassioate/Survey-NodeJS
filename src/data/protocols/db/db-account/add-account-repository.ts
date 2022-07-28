import { AccountModel, AddAccountParams } from '../../../../domain/models/account'

export interface AddAccountRepository {
  add: (value: AddAccountParams) => Promise<AccountModel>
}
