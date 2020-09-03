'use strict'

const Hapi = require('@hapi/hapi')
const inert = require('@hapi/inert')
const vision = require('@hapi/vision')
const good = require('@hapi/good')
const goodConsole = require('@hapi/good-console')
const crumb = require('@hapi/crumb')
const scooter = require('@hapi/scooter')

const path = require('path')
const blankie = require('blankie')

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
    await server.register({
      plugin: crumb,
      options: {
        cookieOptions: {
          isSecure: config.node.environment === 'production'
        }
      }
    })
    await server.register([scooter, {
      plugin: blankie,
      options: {
        defaultSrc: '\'self\' \'unsafe-inline\'',
        styleSrc: '\'self\' \'unsafe-inline\' https://maxcdn.bootstrapcdn.com',
        fontSrc: '\'self\' \'unsafe-inline\' data:',
        scriptSrc: '\'self\' \'unsafe-inline\' https://cdnjs.cloudflare.com https://maxcdn.bootstrapcdn.com/ https://code.jquery.com/',
        generateNonces: false
      }
    }])

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
