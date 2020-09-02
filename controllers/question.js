'use strict'

const { writeFile } = require('fs')
const { promisify } = require('util')
const { join } = require('path')
const { v1: uuid } = require('uuid')

const write = promisify(writeFile)

const { questions } = require('../models/index')

async function createQuestion (req, h) {
  if (!req.state.user) {
    return h.redirect('/login')
  }

  let result, filename
  try {
    if (Buffer.isBuffer(req.payload.image)) {
      filename = `${uuid()}.png`
      await write(join(__dirname, '..', 'public', 'uploads', filename), req.payload.image)
    }

    result = await questions.create(req.payload, req.state.user, filename)
    console.log(`Pregunta creada con el Id ${result}`)
  } catch (error) {
    console.error('Ocurrió un error', error.message, error)

    return h.view('ask', {
      title: 'Crear pregunta',
      error: 'Problemas creando la pregunta'
    }).code(500).takeover()
  }

  return h.redirect(`/question/${result}`)
}

async function answerQuestion (req, h) {
  if (!req.state.user) {
    return h.redirect('/login')
  }

  let result
  try {
    result = await questions.answers(req.payload, req.state.user)
    console.log(`Respuesta creada ${result}`)
  } catch (error) {
    console.error(error)
  }

  return h.redirect(`/question/${req.payload.id}`)
}

async function setAnswerRight (req, h) {
  if (!req.state.user) {
    return h.redirect('/login')
  }

  let result
  try {
    result = await req.server.methods.setAnswerRight(req.params.questionId, req.params.answerId, req.state.user)
    console.log(result)
  } catch (error) {
    console.error(error)
  }

  return h.redirect(`/question/${req.params.questionId}`)
}

module.exports = {
  createQuestion,
  answerQuestion,
  setAnswerRight
}
