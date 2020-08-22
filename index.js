'use strict'

const Hapi = require('@hapi/hapi')

const server = Hapi.server({
  port: process.env.PORT || 3000,
  host: process.env.HOST || 'localhost'
})

async function init () {
  server.route({
    method: 'GET',
    path: '/',
    handler: (req, h) => {
      return h.response('Hola Mundo!').code(200)
    }
  })

  server.route({
    method: 'GET',
    path: '/redirect',
    handler: (req, h) => {
      return h.redirect('http://platzi.com')
    }
  })

  try {
    await server.start()
  } catch (error) {
    console.log(error)
    process.exit(1)
  }

  console.log(`Servidor lanzado en ${server.info.uri}`)
}

init()
