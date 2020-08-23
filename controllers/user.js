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

    if (result) {
      return h.response(result).code(200)
    } else {
      return h.response('Credenciales incorrectas').code(400)
    }
  } catch (error) {
    console.error(error)
    return h.response('Problemas validando el usuario').code(500)
  }
}

module.exports = {
  createUser,
  validateUser
}
