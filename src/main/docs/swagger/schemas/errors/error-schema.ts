export const errorSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string'
    },
    message: {
      type: 'string'
    },
    stack: {
      type: 'string'
    }
  }
}
