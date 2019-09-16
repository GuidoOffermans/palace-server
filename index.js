const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')
const Sse = require('json-sse')

const gameFactory = require(
  './game/router'
)

const Game = require('./game/model')

const userFactory = require(
  './user/router'
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

// async function onStream (
//   request, response
// ) {
//   const messages = await Message
//     .findAll()
//   const data = JSON.stringify(messages)

//   stream.updateInit(data)

//   return stream.init(request, response)
// }

// app.get('/stream', onStream)

const gameRouter = gameFactory()
app.use(gameRouter)

const userRouter = userFactory()
app.use(userRouter)





const port = process.env.PORT || 4000
app.listen(port, () => console.log(`server running on port: ${port}`))