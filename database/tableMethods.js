const db = require('./db');
const {hashPassword,checkPassword} = require('./hashing')

//use 2 different AWS buckets for development & production mode
let s3Url = require('../config/config.json').s3UrlDev
if(process.env.NODE_ENV==='production'){
  s3Url = require('../config/config.json').s3Url
}
const defaultImageUrl = 'profile-default.jpg'
const defaultProfileBackgroundUrl = 'profile-bg.jpg'



module.exports.addTable = function(userId,name,description,filename){
  const query = `
    INSERT INTO tables (user_id,name,description,tableurl)
    VALUES ($1,$2,$3,$4)
    RETURNING id`
  return db.query(query,[userId,name,description,filename])
  .then(function(dbTableId){
    const tableId = dbTableId.rows[0].id
    const query = `
      SELECT first,last,profilepicurl,tables.id,tables.user_id,name,description,tableurl,tables.created_at
      FROM tables INNER JOIN users ON tables.user_id = users.id WHERE tables.id = $1`
    return db.query(query,[tableId])
  })
  .then(function(dbTable){
    const {first,last,profilepicurl,id,user_id:userId,name,description,tableurl,created_at:timestamp} = dbTable.rows[0]
    return {
      first,last,id,userId,name,description,timestamp,
      profilePicUrl: s3Url + profilepicurl,
      tableUrl: s3Url + tableurl
    }
  })
}


module.exports.getTables = function(){
  const query = `
    SELECT first,last,profilepicurl,tables.id,tables.user_id,name,description,tableurl,tables.created_at
    FROM tables
    INNER JOIN users ON tables.user_id = users.id
    ORDER BY created_at DESC LIMIT 20`
  return db.query(query)
  .then(function(dbTables){
    return dbTables.rows.map(table=>{
      const {first,last,profilepicurl,id,user_id:userId,name,description,tableurl,created_at:timestamp} = table
      return {
        first,last,id,userId,name,description,timestamp,
        profilePicUrl: s3Url + profilepicurl,
        tableUrl: s3Url + tableurl
      }
    })
  })
}


module.exports.getTableById = function(tableId){
  const query = `
    SELECT first,last,profilepicurl,tables.id,tables.user_id,name,description,tableurl,tables.created_at
    FROM tables
    INNER JOIN users ON tables.user_id = users.id
    WHERE tables.id = $1`
  return db.query(query,[tableId])
  .then(function(dbTable){
    const {first,last,profilepicurl,id,user_id:userId,name,description,tableurl,created_at:timestamp} = dbTable.rows[0]
    return {
      first,last,id,userId,name,description,timestamp,
      profilePicUrl: s3Url + profilepicurl,
      tableUrl: s3Url + tableurl
    }
  })
}


module.exports.getTablesByUserId = function(userId){
  const query = `
    SELECT first,last,profilepicurl,tables.id,tables.user_id,name,description,tableurl,tables.created_at
    FROM tables
    INNER JOIN users ON tables.user_id = users.id
    WHERE tables.user_id = $1 ORDER BY created_at DESC`
  return db.query(query,[userId])
  .then(function(dbTables){
    return dbTables.rows.map(table=>{
      const {first,last,profilepicurl,id,user_id:userId,name,description,tableurl,created_at:timestamp} = table
      return {
        first,last,id,userId,name,description,timestamp,
        profilePicUrl: s3Url + profilepicurl,
        tableUrl: s3Url + tableurl
      }
    })
  })
}


module.exports.searchTable = function(searchType,searchText){
  let query = `
    SELECT first,last,profilepicurl,tables.id,tables.user_id,name,description,tableurl,tables.created_at
    FROM tables
    INNER JOIN users ON tables.user_id = users.id `
  if(searchType === 'name'){
    query += 'WHERE name ILIKE $1'
    searchText = '%' + searchText + '%'
  } else if(searchType === 'user'){
    query += 'WHERE first ILIKE $1 OR last ILIKE $1'
    searchText = searchText + '%'
  }
  query += ' ORDER BY created_at DESC LIMIT 4'

  return db.query(query,[searchText])
  .then(function(dbTables){
    return dbTables.rows.map(table=>{
      const {first,last,profilepicurl,id,user_id:userId,name,description,tableurl,created_at:timestamp} = table
      return {
        first,last,id,userId,name,description,timestamp,
        profilePicUrl: s3Url + profilepicurl,
        tableUrl: s3Url + tableurl
      }
    })
  })
}
