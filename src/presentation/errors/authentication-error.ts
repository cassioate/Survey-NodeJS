export class UnauthorizedError extends Error {
  constructor () {
    super('Unauthorized')
    this.name = 'UnauthorizedError'
    this.message = 'Unauthorized Error'
  }
}
