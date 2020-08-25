'use strict'

class Questions {
  constructor (db) {
    this.db = db
    this.ref = this.db.ref('/')
    this.collection = this.ref.child('questions')
  }

  async create (data, user) {
    const ask = {
      ...data,
      owner: user
    }

    const question = this.collection.push(ask)

    return question.key
  }

  async getLast (amount, user) {
    const query = await this.collection.limitToLast(amount).once('value')
    const data = query.val()

    return data
  }

  async getOne (id) {
    const query = await this.collection.child(id).once('value')
    const data = query.val()

    return data
  }

  async answers (data, user) {
    const answers = await this.collection.child(data.id).child('answers').push({ text: data.answer, user: user })

    return answers
  }
}

module.exports = Questions
