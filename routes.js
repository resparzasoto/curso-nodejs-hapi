'use strict'

const Joi = require('@hapi/joi')

const site = require('./controllers/site')
const user = require('./controllers/user')
const question = require('./controllers/question')

module.exports = [
  {
    method: 'GET',
    path: '/',
    handler: site.home
  },
  {
    method: 'GET',
    path: '/register',
    handler: site.register
  },
  {
    method: 'POST',
    path: '/create-user',
    options: {
      validate: {
        payload: Joi.object({
          name: Joi.string().min(3).required(),
          email: Joi.string().email().required(),
          password: Joi.string().min(6).required()
        }),
        failAction: user.failValidation
      }
    },
    handler: user.createUser
  },
  {
    method: 'GET',
    path: '/login',
    handler: site.login
  },
  {
    method: 'GET',
    path: '/logout',
    handler: user.logout
  },
  {
    method: 'POST',
    path: '/validate-user',
    options: {
      validate: {
        payload: Joi.object({
          email: Joi.string().email().required(),
          password: Joi.string().min(6).required()
        }),
        failAction: user.failValidation
      }
    },
    handler: user.validateUser
  },
  {
    method: 'GET',
    path: '/ask',
    handler: site.ask
  },
  {
    method: 'POST',
    path: '/create-question',
    options: {
      validate: {
        payload: Joi.object({
          title: Joi.string().required(),
          description: Joi.string().required()
        }),
        failAction: user.failValidation
      }
    },
    handler: question.createQuestion
  },
  {
    method: 'GET',
    path: '/assets/{param*}',
    handler: {
      directory: {
        path: '.',
        index: ['index.html']
      }
    }
  },
  {
    method: ['GET', 'POST'],
    path: '/{any*}',
    handler: site.notFound
  }
]
