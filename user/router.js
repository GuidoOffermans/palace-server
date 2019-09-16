const express = require('express')
const bcrypt = require('bcrypt')


const { Router } = express

const User = require('./model')

function factory () {
  const router = new Router()

  router.post('/sign-up', (req, res, next) => {
    const user = {
      name: req.body.name,
      password: bcrypt.hashSync(req.body.password, 10)
    }
    console.log('sign-up')
    User.create(user)
    .then(user => res.status(201).send(user))
    .catch(err => next(err))
  })

  return router
}

module.exports = factory