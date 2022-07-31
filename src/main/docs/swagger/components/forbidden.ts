export const forbidden = {
  description: 'Não possui permissão para acessar o recurso',
  content: {
    'application/json': {
      schema: {
        $ref: '#/schemas/error'
      }
    }
  }
}
