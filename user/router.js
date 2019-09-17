const express = require('express')

const { Router } = express

const User = require('./model')

function factory (update) {
  const router = new Router()

  async function signup (
    request, response
  ) {
    const {
      name, password
    } = request.body

    const user = await User
      .create({ name, password })

    await update()

    return response.send(message)
  }

  router.post('/sign-up', signup)

  return router
}

module.exports = factory