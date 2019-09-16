const { Router } = require('express')
const { toJWT, toData } = require('./jwt')
const User = require('../user/model')
const bcrypt = require('bcrypt')
// const auth = require('./middleware')

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

// router.get('/secret-endpoint', auth, (req, res) => {
//   const auth = req.headers.authorization && req.headers.authorization.split(' ')
//   if (auth && auth[0] === 'Bearer' && auth[1]) {
//     try {
//       const data = toData(auth[1])
//       res.send({
//         message: 'Thanks for visiting the secret endpoint.',
//         data
//       })
//     }
//     catch (error) {
//       res.status(400).send({
//         message: `Error ${error.name}: ${error.message}`,
//       })
//     }
//   }
//   else {
//     res.status(401).send({
//       message: 'Please supply some valid credentials'
//     })
//   }
// })

module.exports = router