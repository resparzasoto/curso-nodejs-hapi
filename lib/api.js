'use strict'

const Joi = require('@hapi/joi')
const Boom = require('@hapi/boom')

const { questions } = require('../models/index')

module.exports = {
  name: 'api-rest',
  version: '1.0.0',
  register: async function register (server, options) {
    const prefix = options.prefix || 'api'

    server.route({
      method: 'GET',
      path: `/${prefix}/question/{key}`,
      options: {
        validate: {
          params: Joi.object({
            key: Joi.string().required()
          }),
          failAction: faildValidation
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
        validate: {
          params: Joi.object({
            amount: Joi.number().integer().min(1).max(20).required()
          }),
          failAction: faildValidation
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

    function faildValidation (req, h, err) {
      return Boom.badRequest('Por favor use los parámetros correctamente')
    }
  }
}
