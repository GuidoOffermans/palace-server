const Sequelize = require('sequelize')

const databaseUrl = 'postgres://postgres:palace@localhost:5432/postgres' || process.env.DATABASE_URL

const db = new Sequelize(databaseUrl)

db
  .sync({ force: false })
  .then(() => console.log('Synced!'))
  .catch(console.error)

module.exports = db