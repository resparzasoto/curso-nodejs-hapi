'use strict'

const { questions } = require('../models/index')

async function createQuestion (req, h) {
  let result

  try {
    result = await questions.create(req.payload, req.state.user)
    console.log(`Pregunta creada con el Id ${result}`)
  } catch (error) {
    console.error('Ocurrió un error', error.message, error)
    return h.view('ask', {
      title: 'Crear pregunta',
      error: 'Problemas creando la pregunta'
    }).code(500).takeover()
  }

  return h.redirect('/')
}

async function answerQuestion (req, h) {
  let result

  try {
    result = await questions.answers(req.payload, req.state.user)
    console.log(`Respuesta creada ${result}`)
  } catch (error) {
    console.error(error)
  }

  return h.redirect(`/question/${req.payload.id}`)
}

module.exports = {
  createQuestion,
  answerQuestion
}
