'use strict'

module.exports = async function (fastify, opts) {
  fastify.route({
    method: 'GET',
    url: '/',
    schema: {
      tags: [ 'healthcheck' ],
      description: 'healthcheck endpoint to etermine services is up and running',
      response: {
        200: {
          type: 'object',
          properties: {
            status: { type: 'string' },
            timestamp: { type: 'string', format: 'date-time' }
          }
        }
      }
    },
    handler: async (request, reply) => {
      return { status: 'ok', timestamp: new Date().toISOString() }
    }
  })
}
