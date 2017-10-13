const express = require('express')
      app = express(),
      csrf = require('csurf')

const fs = require('fs'),
      path = require('path'),
      compression = require('compression'),
      bodyParser = require('body-parser'),
      cookieParser = require('cookie-parser'),
      cookieSession = require('cookie-session'),
      multer = require('multer'),
      uidSafe = require('uid-safe'),
      knox = require('knox')


const passport = require('passport'),
      GithubStrategy = require('passport-github').Strategy,
      {Github_ClientID,Github_ClientSecret} = require('./secrets.json')

const {middlewares} = require('./express/middlewares'),
      userRouter = require('./express/userRouter'),
      tableRouter = require('./express/tableRouter'),
      chartRouter = require('./express/chartRouter'),
      mockRouter = require('./express/mockRouter')

const {
  createGithubUser,
  loginUser
} = require('./database/methods')


if(process.env.NODE_ENV != 'production'){
  app.use('/bundle.js',require('http-proxy-middleware')({
    target: 'http://localhost:8001'
  }))
}



let sessionSecret
if(process.env.SESSION_SECRET){
  sessionSecret = process.env.SESSION_SECRET
} else {
  sessionSecret = require('./secrets.json').sessionSecret
}
//apply middlewares
app.use(compression())
app.use(cookieSession({
  secret: sessionSecret,
  maxAge: 1000 * 60 * 60 * 24 * 14,
  name: 'funky'
}))
app.use(function(req,res,next){
  console.log('AFTER COOKIE SESSION -->',Object.keys(req.session));
  next()
})

app.use(bodyParser.json())
app.use(function(req,res,next){
  console.log('AFTER BODY PARSER -->',Object.keys(req.session));
  next()
})

app.use(cookieParser())
app.use(function(req,res,next){
  console.log('AFTER COOKIE PARSER -->',Object.keys(req.session));
  next()
})



//PASSPORT MIDDLEWARES
app.use(function(req,res,next){
  console.log('BEFORE PASSPORT -->',Object.keys(req.session));
  next()
})
passport.use(new GithubStrategy({
    clientID: Github_ClientID,
    clientSecret: Github_ClientSecret,
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
app.use(function(req,res,next){
  console.log('AFTER PASSPORT -->',Object.keys(req.session));
  next()
})



//CSURF MIDDLEWARES
app.use(function(req,res,next){
  console.log('BEFORE CSURF -->',Object.keys(req.session));
  next()
})
//prevent csrf attacks
app.use(csrf());
app.use(function(req,res,next){
  res.cookie('csrf-token-cookie', req.csrfToken());
  next();
})
app.use(function(req,res,next){
  console.log('AFTER CSURF -->',Object.keys(req.session));
  next()
})



//serve static files
app.use(express.static('./public'))

//apply routes
app.use('/',userRouter)
app.use('/',tableRouter)
app.use('/',chartRouter)
app.use('/',mockRouter)


//AUTH0
//we will call this to start the GitHub Login process
app.get('/auth/github', passport.authenticate('github'))

//GitHub will then call this URL
app.get('/auth/github/callback', passport.authenticate('github',{failureRedirect:'/'}), function(req,res){
  const {name:first,email,id,avatar_url:profilePicUrl} = req.user['_json']
  const password = id.toString()
  loginUser({email,password})
  .catch(function(err){
    return createGithubUser({
      first,
      last:'',
      email,
      password,
      profilePicUrl
    })
  })
  .then(function(userData){
    //set user info inside session
    req.session.user = userData
    console.log('APP.GET(/auth/github/callback) -->',Object.keys(req.session));
    res.redirect('/')
  })
  .catch(function(err){
    next('Error happened logging Github User')
    console.log(`Error GET '/auth/github/callback' --> ${err}`);
  })
})


//serve React application
//(REDIRECT USER BASED ON HIS REGISTRATION STATUS)
app.get('*', function(req,res){
  console.log('APP.GET(*) -->',Object.keys(req.session));
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
