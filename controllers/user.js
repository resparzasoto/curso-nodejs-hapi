'use strict'

const { users } = require('../models/index')

async function createUser (req, h) {
  try {
    const resultId = await users.create(req.payload)
    return h.response(`Usuario creado correctamente con el Id: ${resultId}`).code(201)
  } catch (error) {
    console.error(error)
    return h.response('Problemas creando el usuario').code(500)
  }
}

async function validateUser (req, h) {
  try {
    const result = await users.validateUser(req.payload)

    if (result === false) {
      return h.response('Credenciales incorrectas').code(401)
    } else {
      return h.redirect('/').state('user', {
        name: result.name,
        email: result.email
      })
    }
  } catch (error) {
    console.error(error)
    return h.response('Problemas validando el usuario').code(500)
  }
}

async function logout (req, h) {
  return h.redirect('/login').unstate('user')
}

module.exports = {
  createUser,
  validateUser,
  logout
}
