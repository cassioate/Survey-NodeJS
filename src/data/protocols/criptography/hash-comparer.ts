export interface HashComparer {
  compare: (passwordAccount: string, passwordAuthentication: string) => Promise<boolean>
}
