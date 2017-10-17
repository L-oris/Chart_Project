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


//PASSPORT CONFIGURATION & MIDDLEWARES
const passport = require('passport'),
GithubStrategy = require('passport-github').Strategy

let secret = {}, callbackUrl
if(process.env.NODE_ENV==='production'){
  secret['GITHUB_KEY'] = process.env.GITHUB_KEY
  secret['GITHUB_SECRET'] = process.env.GITHUB_SECRET
  callbackUrl = 'https://awesome-charts.herokuapp.com/auth/github/callback'
} else {
  secret = require('./secrets.json')
  callbackUrl = 'http://localhost:8000/auth/github/callback'
}

passport.use(new GithubStrategy({
    clientID: secret.GITHUB_KEY,
    clientSecret: secret.GITHUB_SECRET,
    callbackUrl
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
