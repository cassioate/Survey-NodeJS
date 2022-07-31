export const signUpPath = {
  post: {
    tags: ['Login'],
    summary: 'API para cadastrar usuário',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/signUpParams'
          }
        }
      }
    },
    responses: {
      200: {
        description: 'Sucesso',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/signUpSuccess'
            }
          }
        }
      },
      400: {
        $ref: '#/components/badRequest'
      },
      403: {
        $ref: '#/components/forbidden'
      },
      500: {
        $ref: '#/components/internalServer'
      }
    }
  }
}
