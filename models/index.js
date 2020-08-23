'use strict'

const firebase = require('firebase-admin')

const config = require('../config/index')
const serviceAccountKey = require('../config/firebase-secrets.json')

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccountKey),
  databaseURL: config.firebase.databaseURL
})

const db = firebase.database()

const Users = require('./users')

module.exports = {
  users: new Users(db)
}
