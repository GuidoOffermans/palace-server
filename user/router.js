const express = require('express')
const bcrypt = require('bcrypt')
const { loginUser } = require('../auth/router')

const { Router } = express

const User = require('./model')

function factory (update) {
  const router = new Router()


  router.post('/sign-up', (req, res, next) => {
    console.log(req.body)
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