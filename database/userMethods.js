const db = require('./db');
const {hashPassword,checkPassword} = require('./hashing')

//use 2 different AWS buckets for development & production mode
let s3Url = require('../config/config.json').s3UrlDev
if(process.env.NODE_ENV==='production'){
  s3Url = require('../config/config.json').s3Url
}
const defaultImageUrl = 'profile-default.jpg'
const defaultProfileBackgroundUrl = 'profile-bg.jpg'



module.exports.createUser = function({first,last,email,password}){
  return hashPassword(password)
  .then(function(hash){
    const query = `
      INSERT INTO users (first,last,email,password,profilepicurl,profile_background_url)
      VALUES ($1,$2,$3,$4,'${defaultImageUrl}','${defaultProfileBackgroundUrl}')
      RETURNING id,first,last,email,profilepicurl,profile_background_url`
    return db.query(query,[first,last,email,hash])
  })
  .then(function(userData){
    const {id:userId,first,last,email,profilepicurl,profile_background_url} = userData.rows[0]
    return {
      userId,first,last,email,
      profilePicUrl: s3Url + profilepicurl,
      profileBackgroundUrl: s3Url + profile_background_url
    }
  })
}


module.exports.loginUser = function({email,password:plainTextPassword}){
  //here password passed in has been renamed to 'plainTextPassword'
  const query = `
    SELECT id,first,last,email,password,profilepicurl,profile_background_url
    FROM users
    WHERE email = $1`
  return db.query(query,[email])
  .then(function(userData){
    const {id:userId,first,last,email,password:hashedPassword,profilepicurl,profile_background_url} = userData.rows[0]
    return {
      userId,first,last,email,hashedPassword,
      profilePicUrl: s3Url + profilepicurl,
      profileBackgroundUrl: s3Url + profile_background_url
    }
  })
  .then(function({userId,first,last,email,hashedPassword,profilePicUrl,profileBackgroundUrl}){
    //compare saved password with new one provided from user
    return checkPassword(plainTextPassword,hashedPassword)
    .then(function(doesMatch){
      if(!doesMatch){
        throw 'Passwords do not match!'
      }
      return {
        userId,first,last,email,profilePicUrl,profileBackgroundUrl
      }
    })
  })
}


module.exports.updateProfilePic = function(userId,filename){
  const query = `
    UPDATE users
    SET profilepicurl = $1
    WHERE id = $2`
  return db.query(query,[filename,userId])
  .then(function(){
    return {
      profilePicUrl: s3Url + filename
    }
  })
}


module.exports.updateProfileBackground = function(userId,filename){
  const query = `
    UPDATE users
    SET profile_background_url = $1
    WHERE id = $2`
  return db.query(query,[filename,userId])
  .then(function(){
    return {
      profileBackgroundUrl: s3Url + filename
    }
  })
}
