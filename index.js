const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')
const Sse = require('json-sse')

const gameFactory = require(
  './game/router'
)

const Game = require('./game/model')

const userFactory = require(
  './game/router'
)

const User = require('./user/model')

const stream = new Sse()

const app = express()

const middleware = cors()
app.use(middleware)

const jsonParser = bodyParser.json()
app.use(jsonParser)

async function update () {

}





const port = process.env.PORT || 4000
app.listen(port, () => console.log(`server running on port: ${port}`))