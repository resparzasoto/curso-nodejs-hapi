'use strict'

function home (req, h) {
  return h.view('index', {
    title: 'home',
    user: req.state.user
  })
}

function register (req, h) {
  if (req.state.user) {
    return h.redirect('/')
  }

  return h.view('register', {
    title: 'Registro',
    user: req.state.user
  })
}

function login (req, h) {
  if (req.state.user) {
    return h.redirect('/')
  }

  return h.view('login', {
    title: 'Iniciar sesión',
    user: req.state.user
  })
}

module.exports = {
  home,
  register,
  login
}
