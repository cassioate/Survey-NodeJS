import { AccountModel, AddAccountParams } from '../../models/account'

export interface AddAccount {
  add: (account: AddAccountParams) => Promise<AccountModel>
}
