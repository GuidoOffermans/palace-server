const Sequelize = require('sequelize')

const db = require('../db')
const User = require(
  '../user/model'
)

const Game = db.define(
  'game',
  {
    name:Sequelize.STRING,
    deck_id: Sequelize.STRING,
    game_info: Sequelize.JSON,
    game_status:{
      type: Sequelize.ENUM,
      values: ['waiting', 'playing', 'done'],
      defaultValue: 'waiting'
    }
  }
)

Game.hasMany(User)
User.belongsTo(Game)

module.exports = Game