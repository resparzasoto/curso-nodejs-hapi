'use strict'

class Questions {
  constructor (db) {
    this.db = db
    this.ref = this.db.ref('/')
    this.collection = this.ref.child('questions')
  }

  async create (data, user) {
    data = {
      ...data,
      owner: user
    }

    const question = this.collection.push(data)

    return question.key
  }
}

module.exports = Questions
