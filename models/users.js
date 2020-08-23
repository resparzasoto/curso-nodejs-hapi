'user strict'

const bcrypt = require('bcrypt')

const SALT_ROUNDS = 10

class Users {
  constructor (db) {
    this.db = db
    this.ref = this.db.ref('/')
    this.collection = this.ref.child('users')
  }

  async create (data) {
    const user = {
      ...data,
      password: await this.constructor.encrypt(data.password)
    }

    const newUser = this.collection.push(user)

    return newUser.key
  }

  async validateUser (data) {
    let result = false
    const userQuery = await this.collection.orderByChild('email').equalTo(data.email).once('value')
    const userFound = userQuery.val()

    if (userFound) {
      const userId = Object.keys(userFound)[0]
      const passwordRight = await bcrypt.compare(data.password, userFound[userId].password)
      result = (passwordRight) ? userFound[userId] : false
    }

    return result
  }

  static async encrypt (password) {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)
    return hashedPassword
  }
}

module.exports = Users
