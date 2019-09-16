const Sequelize = require('sequelize')

const databaseUrl = process
  .env
  .DATABASE_URL ||
  'postgres://postgres:palace@localhost:5432/postgres'

const db = new Sequelize(databaseUrl)

db
  .sync({ force: false })
  .then(() => console.log('Synced!'))
  .catch(console.error)

module.exports = db