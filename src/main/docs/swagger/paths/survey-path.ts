export const surveyPath = {
  get: {
    tags: ['Enquete'],
    security: [{
      apiKeyAuth: [],
      apiKeyAuthExample: []
    }],
    summary: 'API para listar todas as enquetes',
    responses: {
      200: {
        description: 'Sucesso',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/surveys'
            }
          }
        }
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
  post: {
    tags: ['Enquete'],
    security: [{
      apiKeyAuth: [],
      apiKeyAuthExample: []
    }],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/surveyParams'
          }
        }
      }
    },
    summary: 'API para criar enquete',
    responses: {
      204: {
        description: 'Sucesso, sem conteúdo'
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
