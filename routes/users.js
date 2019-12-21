const express = require('express')
const router = express.Router()
const User = require('../models/users')
const passport = require('passport')
const bcrypt = require('bcryptjs')
//login
router.get('/login', (req, res) => {
  res.render('login')
})
//login post
router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login'
  })
)
//register
router.get('/register', (req, res) => {
  res.render('register')
})
//register post
router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body
  User.findOne({ email: email }).then((user) => {
    if (user) {
      res.render('register', {
        name,
        email,
        password,
        password2
      })
    }
    else {

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
          //建立新資料
          console.log(hash)
          const newUser = new User({
            name,
            email,
            password: hash
          })
          //儲存
          newUser.save().then(
            (user) => {
              res.redirect('/')
            }
          ).catch(
            (err) => {
              console.log(err)
            }
          )
        })
      })

    }

  })
})
//logout
router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/users/login')
})

module.exports = router