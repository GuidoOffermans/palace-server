const { Router } = require('express')
const { toJWT, toData } = require('./jwt')
const User = require('../user/model')
const bcrypt = require('bcrypt')
const auth = require('./middleware')

const router = new Router()

const login = (req, res, next) => {
  console.log('I am inside login function handler')
  console.log('login body:', req.body)
  if (!req.body.name || !req.body.password) {
    res.status(400).send({ message: 'Please, supply a valid name and password' })
  } else {
    User.findOne({
      where: {
        name: req.body.name
      }
    })
      .then(user => {
        if (!user) {
          res.status(400).send({
            message: 'User with that name does not exist'
          })
        } else if (bcrypt.compareSync(req.body.password, user.password)) {
          res.send({
            jwt: toJWT({ userId: user.id })
          })
        }
        else {
          res.status(400).send({
            message: 'Password was incorrect'
          })
        }
      })
      .catch(err => {
        console.error(err)
        res.status(500).send({
          message: 'Something went wrong'
        })
      })
  }
}

router.post('/login', login)

module.exports = router