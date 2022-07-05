export interface UpdateAccessTokenRepository {
  update: (accountId: string, acessToken: string) => Promise<void>
}
