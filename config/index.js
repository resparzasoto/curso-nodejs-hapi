module.exports = {
  node: {
    port: process.env.PORT,
    host: process.env.HOST,
    environment: process.env.NODE_ENV
  },
  firebase: {
    databaseURL: process.env.FIREBASE_DATABASE_URL
  }
}
