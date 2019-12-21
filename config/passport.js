const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const mongoose = require('mongoose')
const User = require('../models/users')
const passport = require('passport')
const bcrypt = require('bcryptjs')
module.exports = passport => {
  passport.use(new LocalStrategy({
    usernameField: 'email'
  },
    (email, password, done) => {
      User.findOne({ email, email }, (err, user) => {
        if (err) { return done(err) }
        if (!user) { return done(null, false) }
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (isMatch) {
            return done(null, user)
          } else {
            return done(null, false)
          }
        })
      })
    }
  ))

  passport.use(new FacebookStrategy({
    clientID: '443390463004035',
    clientSecret: '7728b53fcbe3a6d18348386a4dbeaf27',
    callbackURL: "http://localhost:3000/auth/facebook/callback",
    profileFields: ['email', 'displayName']
  },
    (accessToken, refreshToken, profile, done) => {
      console.log(profile)
      User.findOne({ email: profile._json.email }, (err, user) => {
        if (!user) {
          var randomPassword = Math.random().toString(36).slice(-8)
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(randomPassword, salt, (err, hash) => {
              const newUser = new User({
                name: profile._json.name,
                email: profile._json.email,
                password: hash
              })
              newUser.save().then(user => {
                return done(null, user)
              })
            })
          })

        } else {
          return done(null, user)
        }
      })
      // User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      //   return cb(err, user);
      // });
    }
  ));

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user)
    })
  })
}