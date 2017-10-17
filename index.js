const express = require('express')
      app = express()

const {middlewares} = require('./express/middlewares'),
      userRouter = require('./express/userRouter'),
      tableRouter = require('./express/tableRouter'),
      chartRouter = require('./express/chartRouter'),
      mockRouter = require('./express/mockRouter')


if(process.env.NODE_ENV != 'production'){
  app.use('/bundle.js',require('http-proxy-middleware')({
    target: 'http://localhost:8001'
  }))
}



//apply middlewares
middlewares(app)


//PASSPORT CONFIGURATION
const passport = require('passport'),
GithubStrategy = require('passport-github').Strategy

let GITHUB_KEY, GITHUB_SECRET
if(process.env.NODE_ENV==='production'){
  GITHUB_KEY = process.env.GITHUB_KEY
  GITHUB_SECRET = process.env.GITHUB_SECRET
} else {
  GITHUB_KEY = require('./secrets.json').GITHUB_KEY
  GITHUB_SECRET = require('./secrets.json').GITHUB_SECRET
}

passport.use(new GithubStrategy({
    clientID: GITHUB_KEY,
    clientSecret: GITHUB_SECRET,
    callbackURL: 'http://localhost:8000/auth/github/callback'
  },
  function(accessToken, refreshToken, profile, done) {
    return done(null, profile)
  }
))
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function(user, done) {
  // placeholder for custom user serialization
  // null is for errors
  done(null, {})
})
passport.deserializeUser(function(user, done) {
  // placeholder for custom user deserialization.
  // maybe you are going to get the user from mongo by id?
  // null is for errors
  done(null, {})
})


//serve static files
app.use(express.static('./public'))

//apply routes
app.use('/',userRouter)
app.use('/',tableRouter)
app.use('/',chartRouter)
app.use('/',mockRouter)


//PASSPORT ROUTES



//serve React application
//(REDIRECT USER BASED ON HIS REGISTRATION STATUS)
app.get('*', function(req,res){
  if(!req.session.user && req.url !== '/welcome'){
    return res.redirect('/welcome')
  }
  res.sendFile(__dirname + '/index.html')
})


//handle 'Express' errors
app.use(function (err, req, res, next){
  console.log(`Server Error --> ${err}`)
  res.status(500).json({success:false})
})


const port = process.env.PORT || 8000
app.listen(port, function(){
  console.log(`Server listening on port ${port}`)
})
