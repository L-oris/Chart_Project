const express = require('express')
      app = express()

const passport = require('passport'),
      GithubStrategy = require('passport-github').Strategy,
      {Github_ClientID,Github_ClientSecret} = require('./secrets.json')

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
  done(null, user)
})

passport.deserializeUser(function(user, done) {
  // placeholder for custom user deserialization.
  // maybe you are going to get the user from mongo by id?
  // null is for errors
  done(null, user)
})


//serve static files
app.use(express.static('./public'))

//apply routes
app.use('/',userRouter)
app.use('/',tableRouter)
app.use('/',chartRouter)
app.use('/',mockRouter)


//AUTH0
const {
  createGithubUser,
  loginUser
} = require('./database/methods')

//we will call this to start the GitHub Login process
app.get('/auth/github', passport.authenticate('github'))

//GitHub will then call this URL
app.get('/auth/github/callback', passport.authenticate('github',{failureRedirect:'/'}), function(req,res){
  console.log('USER RECEIVED FROM GITHUB');

  const {name:first,email,id,avatar_url:profilePicUrl} = req.user['_json']
  const password = id.toString()

  console.log('TRY TO LOGIN USER');
  loginUser({email,password})
  .catch(function(err){
    console.log('LOGIN OF USER FAILED, TRY TO REGISTER HIM');
    return createGithubUser({
      first,
      last:'',
      email,
      password,
      profilePicUrl
    })
  })
  .then(function(userData){
    console.log('NEW GITHUB USER CORRECTLY REGISTERED-LOGGED IN');
    //set user info inside session
    req.session.user = userData
    console.log('NOW SESSION CORRECTLY SETUP',req.session.user);
    console.log('------------------');
    res.json({success:true})
  })
  .catch(function(err){
    console.log('SOME ERRORS HAPPENED CREATING NEW GITHUB USER',err);
  })

})


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
