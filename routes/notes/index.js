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

  fastify.addHook('preHandler', isLoggedIn);

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
      const userId = request.user

      return notesDAL.getNotes(vectorSearch, userId);
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
      const userId = request.user;

      const updateNote = await notesDAL.updateNote(id, title, body, userId);
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
      const userId = request.user;

      try {
        await notesDAL.findNoteById(id, userId)
      } catch (error) {
        reply.code(404)
        throw new Error('Resource not found')
      }

      await notesDAL.deleteNote(id, userId);
      reply.status(204);
    }
  })
}
