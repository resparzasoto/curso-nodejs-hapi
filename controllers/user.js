'use strict'

const { users } = require('../models/index')

async function createUser (req, h) {
  try {
    const resultId = await users.create(req.payload)

    if (resultId) {
      return h.view('register', {
        title: 'Registro',
        success: 'Usuario creado exitosamente'
      })
    } else {
      return h.view('register', {
        title: 'Registro',
        error: 'Problemas creando el usuario'
      })
    }
  } catch (error) {
    console.error(error)
    return h.view('register', {
      title: 'Registro',
      error: 'Problemas creando el usuario'
    })
  }
}

async function logout (req, h) {
  return h.redirect('/login').unstate('user')
}

async function validateUser (req, h) {
  try {
    const result = await users.validateUser(req.payload)

    if (result === false) {
      return h.view('login', {
        title: 'Iniciar sesión',
        error: 'Credenciales incorrectas'
      })
    } else {
      return h.redirect('/').state('user', {
        name: result.name,
        email: result.email
      })
    }
  } catch (error) {
    console.error(error)

    return h.view('login', {
      title: 'Iniciar sesión',
      error: 'Problemas validando el usuario'
    })
  }
}

function failValidation (req, h, err) {
  const templates = {
    '/create-user': 'register',
    '/validate-user': 'login'
  }

  return h.view(templates[req.path], {
    title: 'Error de validación',
    error: 'Por favor complete los campos requeridos'
  }).code(400).takeover()
}

module.exports = {
  createUser,
  logout,
  validateUser,
  failValidation
}
