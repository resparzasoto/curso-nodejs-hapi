'use strict'

const Joi = require('@hapi/joi')
const Boom = require('@hapi/boom')
const Basic = require('@hapi/basic')

const { questions, users } = require('../models/index')

module.exports = {
  name: 'api-rest',
  version: '1.0.0',
  register: async function register (server, options) {
    const prefix = options.prefix || 'api'

    await server.register(Basic)

    server.auth.strategy('simple', 'basic', { validate: validateAuth })
    server.auth.default('simple')

    server.route({
      method: 'GET',
      path: `/${prefix}/question/{key}`,
      options: {
        auth: 'simple',
        validate: {
          params: Joi.object({
            key: Joi.string().required()
          }),
          failAction: failValidation
        }
      },
      handler: async function handler (req, h) {
        let result
        try {
          result = await questions.getOne(req.params.key)
          if (!result) {
            return Boom.notFound(`No se pudo encontrar la pregunta ${req.params.key}`)
          }
        } catch (error) {
          return Boom.badImplementation(`Hubo un error buscando ${req.params.key}`)
        }

        return result
      }
    })

    server.route({
      method: 'GET',
      path: `/${prefix}/questions/{amount}`,
      options: {
        auth: 'simple',
        validate: {
          params: Joi.object({
            amount: Joi.number().integer().min(1).max(20).required()
          }),
          failAction: failValidation
        }
      },
      handler: async function handler (req, h) {
        let result
        try {
          result = await questions.getLast(req.params.amount)
          if (!result) {
            return Boom.notFound('No se pudierón recuperar las preguntas')
          }
        } catch (error) {
          return Boom.badImplementation('Hubo un error recuperando las preguntas')
        }

        return result
      }
    })

    function failValidation (req, h, err) {
      return Boom.badRequest('Por favor use los parámetros correctamente')
    }

    async function validateAuth (req, username, passwd, h) {
      let user
      try {
        user = await users.validateUser({ email: username, password: passwd })
      } catch (error) {
        server.log('error', error)
      }

      return {
        credentials: user || {},
        isValid: (user !== false)
      }
    }
  }
}
