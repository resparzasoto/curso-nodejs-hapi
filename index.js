'use strict'

const Hapi = require('@hapi/hapi')
const inert = require('@hapi/inert')
const vision = require('@hapi/vision')
const good = require('@hapi/good')
const goodConsole = require('@hapi/good-console')

const path = require('path')

const handlerbars = require('./lib/helpers')
const methods = require('./lib/methods')

const routes = require('./routes')
const config = require('./config/index')
const site = require('./controllers/site')

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
    await server.register({
      plugin: good,
      options: {
        reporters: {
          console: [
            {
              module: goodConsole
            },
            'stdout'
          ]
        }
      }
    })
    await server.register({
      plugin: require('./lib/api'),
      options: {
        prefix: 'api'
      }
    })

    server.method('setAnswerRight', methods.setAnswerRight)
    server.method('getLast', methods.getLast, {
      cache: {
        expiresIn: 1000 * 60,
        generateTimeout: 1000 * 2
      }
    })

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

    server.ext('onPreResponse', site.fileNotFound)
    server.route(routes)

    await server.start()
  } catch (error) {
    server.log('error', error)
    process.exit(1)
  }

  server.log('info', `Servidor lanzado en ${server.info.uri}`)
}

process.on('unhandledRejection', error => {
  server.log('UnhandleRejection', error)
})

process.on('uncaughtException', error => {
  server.log('UnhandleRejection', error)
})

init()
