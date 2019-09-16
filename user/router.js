const express = require('express')

const { Router } = express

const User = require('./model')

function factory () {
  const router = new Router()

  router.post('/sign-up', (req, res, next) => {
    console.log('sign-up')
    User.create(req.body)
    .then(user => res.status(201).send(user))
    .catch(err => next(err))
  })

  return router
}

module.exports = factory