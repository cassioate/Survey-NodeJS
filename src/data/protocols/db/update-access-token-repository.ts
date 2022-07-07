export interface UpdateAccessTokenRepository {
  updateAccessToken: (accountId: string, acessToken: string) => Promise<void>
}
