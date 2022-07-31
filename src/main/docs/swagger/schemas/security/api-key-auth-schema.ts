export const apiKeyAuthSchema = {
  apiKeyAuth: {
    type: 'apiKey',
    in: 'header',
    name: 'x-access-token'
  },
  apiKeyAuthExample: {
    type: 'apiKey',
    in: 'header',
    name: 'x-access-token-Example'
  }
}
