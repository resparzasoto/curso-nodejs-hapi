'use strict'

const handlebars = require('handlebars')

function registerHelpers () {
  handlebars.registerHelper('answerNumber', answers => {
    if (!answers) {
      return 0
    }

    const keys = Object.keys(answers)
    return keys.length
  })

  handlebars.registerHelper('ifEquals', (a, b, options) => {
    if (a === b) {
      return options.fn(this)
    } else {
      return options.inverse(this)
    }
  })

  return handlebars
}

module.exports = registerHelpers()
