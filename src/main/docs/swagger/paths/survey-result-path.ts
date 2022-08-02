export const surveysResultPath = {
  get: {
    tags: ['Enquete'],
    security: [{
      apiKeyAuth: []
    }],
    parameters: [{
      in: 'path',
      name: 'surveyId',
      description: 'ID da enquete respondida',
      required: true,
      schema: {
        type: 'string'
      }
    }],
    summary: 'API para listar o resultado da enquete',
    responses: {
      200: {
        description: 'Sucesso',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/surveysResult'
            }
          }
        }
      },
      400: {
        $ref: '#/components/badRequest'
      },
      401: {
        $ref: '#/components/unauthorized'
      },
      403: {
        $ref: '#/components/forbidden'
      },
      500: {
        $ref: '#/components/internalServer'
      }
    }
  },
  put: {
    tags: ['Enquete'],
    security: [{
      apiKeyAuth: []
    }],
    parameters: [{
      in: 'path',
      name: 'surveyId',
      description: 'ID da enquete respondida',
      required: true,
      schema: {
        type: 'string'
      }
    }],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/surveysResultParams'
          }
        }
      }
    },
    summary: 'API para adicionar ou alterar resposta da enquete',
    responses: {
      200: {
        description: 'Sucesso',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/surveysResult'
            }
          }
        }
      },
      400: {
        $ref: '#/components/badRequest'
      },
      401: {
        $ref: '#/components/unauthorized'
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
