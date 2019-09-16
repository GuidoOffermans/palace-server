const express = require('express')

const { Router } = express

const Game = require('./model')

function factory (update) {
  const router = new Router()

  async function onGame (
    request, response
  ) {
    const { name } = request.body

    const game = await Game
      .create({ name })

    await update()

    return response.send(game)
  }

  router.post('/game', onGame)

  return router
}

module.exports = factory