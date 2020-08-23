'use strict'

function home (req, h) {
  return h.view('index', {
    title: 'home'
  })
}

function register (req, h) {
  return h.view('register', {
    title: 'Registro'
  })
}

function login (req, h) {
  return h.view('login', {
    title: 'Iniciar sesión'
  })
}

module.exports = {
  home,
  register,
  login
}
