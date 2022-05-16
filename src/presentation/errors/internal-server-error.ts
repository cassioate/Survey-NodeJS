export class InternalServerError extends Error {
  constructor () {
    super('InternalServerError')
    this.name = 'InternalServerError'
  }
}
