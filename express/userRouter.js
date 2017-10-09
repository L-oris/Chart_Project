const express = require('express'),
      router = express.Router()

const {uploader,uploadToS3} = require('./middlewares')
const {
  createUser,
  loginUser,
  updateProfilePic,
  updateProfileBackground,
} = require('../database/methods')



//CREATE NEW USER INTO DATABASE
router.post('/api/register', function(req,res,next){
  const {first,last,email,password} = req.body
  if(!(first&&last&&email&&password)){
    throw 'Not all fields provided for registering a new user'
  }
  createUser(req.body)
  .then(function(userData){
    //set user info inside session
    req.session.user = userData
    res.json({success:true})
  })
  .catch(function(err){
    next('Error happened adding user to database')
    console.log(`Error POST '/api/register' --> ${err}`);
  })
})


//CHECK FOR ALREADY REGISTERED USER
router.post('/api/login', function(req,res,next){
  const {email,password} = req.body
  if(!(email&&password)){
    throw 'Not all fields provided for logging in the user'
  }
  loginUser(req.body)
  .then(function(userData){
    //set user info inside session
    req.session.user = userData
    res.json({success:true})
  })
  .catch(function(err){
    next('User not found')
    console.log(`Error POST '/api/login' --> ${err}`);
  })
})


//GET LOGGED-IN USER'S INFO (FROM SESSION)
router.get('/api/get_current_user',function(req,res){
  if(!req.session.user){
    throw 'No logged in user in current session'
  }
  res.json(req.session.user)
})


//UPDATE USER'S PROFILE PICTURE
router.put('/api/update_profile_pic',uploader.single('file'),uploadToS3,function(req,res,next){
  const {userId} = req.session.user
  const {filename} = req.file
  if(!filename){
    throw 'No file to upload'
  }
  updateProfilePic(userId,filename)
  .then(function(userData){
    req.session.user.profilePicUrl = userData.profilePicUrl
    res.json(userData)
  })
  .catch(function(err){
    next('Uploading of new profile image failed')
    console.log(`Error PUT '/api/update_profile_pic' --> ${err}`);
  })
})


//UPDATE USER'S PROFILE BACKGROUND IMAGE
router.put('/api/update_profile_background',uploader.single('file'),uploadToS3,function(req,res,next){
  const {userId} = req.session.user
  const {filename} = req.file
  if(!filename){
    throw 'No file to upload'
  }
  updateProfileBackground(userId,filename)
  .then(function(userData){
    req.session.user.profileBackgroundUrl = userData.profileBackgroundUrl
    res.json(userData)
  })
  .catch(function(err){
    next('Uploading of new profile background image failed')
    console.log(`Error PUT '/api/update_profile_background' --> ${err}`);
  })
})


//LOGOUT USER
router.get('/api/logout',function(req,res){
  req.session = null
  res.redirect('/welcome')
})


module.exports = router
