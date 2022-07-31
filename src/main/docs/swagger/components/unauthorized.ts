export const unauthorized = {
  description: 'Acesso não autorizado',
  content: {
    'application/json': {
      schema: {
        $ref: '#/schemas/error'
      }
    }
  }
}
