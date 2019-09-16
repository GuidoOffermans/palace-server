const express = require('express')

const { Router } = express

const User = require('./model')

function factory (update) {
  const router = new Router()

  router.post('/sign-up', (req, res, next) => {
    User.create(req.body)
    .then(user => res.status(201).send(user))
    .catch(err => next(err))
  })

  return router
}

module.exports = factory