const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const Sse = require('json-sse');

const gameFactory = require('./game/router');

const Game = require('./game/model');

const userFactory = require('./user/router');

const User = require('./user/model');

const stream = new Sse();

const app = express();

const middleware = cors();
app.use(middleware);

const jsonParser = bodyParser.json();
app.use(jsonParser);


const loginRouter = require('./auth/router')
app.use(loginRouter)

async function update () {
  const games = await Game
    .findAll({ include: [User] })

  games.map(game => {
    const string = JSON.stringify(
      game.dataValues,
      null,
      2
    )

    console.log('string test:', string)
  })

  const data = JSON.stringify(games)

  stream.send(data)
}


async function onStream (
  request, response
) {
  const games = await Game
    .findAll()
  const data = JSON.stringify(games)

  stream.updateInit(data)

  return stream.init(request, response)
}

app.get('/stream', onStream)

const gameRouter = gameFactory(update);
app.use(gameRouter);

const userRouter = userFactory(update);
app.use(userRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`server running on port: ${port}`));
