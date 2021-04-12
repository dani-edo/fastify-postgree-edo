'use strict'

const NotesDAL = require('../service/notesDAL');

module.exports = async function (fastify, opts) {
  const notesDAL = NotesDAL(fastify.db);

  fastify.get('/', async function (request, reply) {
    return { root: true }
  })
  fastify.route({
    method: 'GET',
    url: '/healthcheck',
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

  fastify.route({
    method: 'POST',
    url: '/notes',
    schema: {
      tags: [ 'notes' ],
      description: 'Create a note',
      body: {
        type: 'object',
        required: ['title', 'body'],
        properties: {
          title: { type: 'string' },
          body: { type: 'string' }
        }
      },
      response: {
        200: {
          type: 'object',
          required: ['id', 'title', 'body'],
          properties: {
            id: { type: 'number', description: 'Unique identifier for ...' },
            title: { type: 'string' },
            body: { type: 'string', description: 'Main content of the ...' }
          }
        }
      }
    },
    handler: async (request, reply) => {
      const { title, body } = request.body;
      const newNote = await notesDAL.createNote(title, body);
      return newNote
    }
  })
}
