'use strict'

const Hapi = require('@hapi/hapi')
const inert = require('@hapi/inert')
const vision = require('@hapi/vision')
const handlerbars = require('handlebars')
const path = require('path')

const routes = require('./routes')
const config = require('./config/index')

const server = Hapi.server({
  port: config.node.port,
  host: config.node.host,
  routes: {
    files: {
      relativeTo: path.join(__dirname, 'public')
    }
  }
})

async function init () {
  try {
    await server.register(inert)
    await server.register(vision)

    server.state('user', {
      ttl: 1000 * 60 * 60 * 24 * 7,
      isSecure: config.node.environment === 'production',
      encoding: 'base64json'
    })

    server.views({
      engines: {
        hbs: handlerbars
      },
      relativeTo: __dirname,
      path: 'views',
      layout: true,
      layoutPath: 'views'
    })

    server.route(routes)

    await server.start()
  } catch (error) {
    console.log(error)
    process.exit(1)
  }

  console.log(`Servidor lanzado en ${server.info.uri}`)
}

process.on('unhandledRejection', error => {
  console.error('UnhandleRejection', error.message, error)
})

process.on('uncaughtException', error => {
  console.error('UncaughtException', error.message, error)
})

init()
