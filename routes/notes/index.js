'use strict'

const { noteSchema } = require('./schemas');
const NotesDAL = require('../../service/notesDAL');
const { isLoggedIn } = require('../../middleware/isLoggedIn');

/**
 * 
 * @param {import('fastify').FastifyInstance} fastify 
 * @param {*} opts 
 */

module.exports = async function (fastify, opts) {
  const notesDAL = NotesDAL(fastify.db);

  fastify.route({
    method: 'GET',
    url: '/',
    schema: {
      tags: [ 'notes' ],
      description: 'Get all notes',
      querystring: {
        type: 'object',
        properties: {
          'filter[body]': { type: 'string', description: 'Vector match against the body field' }
        }
      },
      response: {
        200: {
          type: 'array',
          items: noteSchema
        }
      }
    },
    handler: async (request, reply) => {
      const vectorSearch = request.query['filter[body]']
      return notesDAL.getNotes(vectorSearch);
    }
  })

  fastify.route({
    method: 'POST',
    url: '/',
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
        200: noteSchema
      }
    },
    preHandler: isLoggedIn,
    handler: async (request, reply) => {
      const { title, body } = request.body;
      const userId = request.user;
      const newNote = await notesDAL.createNote(title, body, userId);
      return newNote
    }
  })

  fastify.route({
    method: 'PUT',
    url: '/:id',
    schema: {
      tags: [ 'notes' ],
      description: 'Update a note',
      body: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          body: { type: 'string' }
        }
      },
      response: {
        200: noteSchema
      }
    },
    handler: async (request, reply) => {
      const { id } = request.params;
      const { title, body } = request.body;
      const updateNote = await notesDAL.updateNote(id, title, body);
      return updateNote
    }
  })

  fastify.route({
    method: 'DELETE',
    url: '/:id',
    schema: {
      tags: [ 'notes' ],
      description: 'Delete a note - WARNING - PERMANENT',
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'number' },
        }
      },
      response: {
        204: {
          type: 'string',
          default: 'no content'
        }
      }
    },
    handler: async (request, reply) => {
      const { id } = request.params;
      const updateNote = await notesDAL.deleteNote(id);
      reply.status(204);
    }
  })
}
