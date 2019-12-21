const express = require('express')
const app = express()
const port = 3000
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const session = require('express-session')
const passport = require('passport')
//add a template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
//set template engine
app.set('view engine', 'handlebars')
//set static file
app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: true }))

app.use(session({
    secret: 'secret code',
    resave: false,
    saveUninitialized: true
}))


//connect mongodb
mongoose.connect('mongodb://localhost/resList', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
//return 'connection' when connect mongodb
const db = mongoose.connection
//set db status
db.on('error', () => {
    console.log('connect error')
})
db.once('open', () => {
    console.log('mongodb connected')
})
const resList = require('./models/resList.js')

app.use(passport.initialize())
app.use(passport.session())
require('./config/passport')(passport)
//route
app.use((req, res, next) => {
    res.locals.user = req.user
    res.locals.isAuthenticated = req.isAuthenticated()
    next()
})
app.use(methodOverride('_method'))
app.use('/', require('./routes/route.js'))
app.use('/users', require('./routes/users'))
app.use('/auth', require('./routes/auth'))
//start and listen server
app.listen(port, () => {
    console.log(`Express is listening on localhost:${port}`)
})