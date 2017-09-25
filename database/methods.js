const db = require('./db');
const {hashPassword,checkPassword} = require('./hashing')
const {s3Url} = require('../config/config.json')
const defaultImageUrl = 'profile-default.jpg'


module.exports.createUser = function({first,last,email,password}){
  return hashPassword(password)
  .then(function(hash){
    const query = `INSERT INTO users (first,last,email,password,profilepicurl) VALUES ($1,$2,$3,$4,'${defaultImageUrl}') RETURNING id,first,last,email,profilepicurl`
    return db.query(query,[first,last,email,hash])
  })
  .then(function(userData){
    const {id:userId,first,last,email,profilepicurl} = userData.rows[0]
    return {
      userId,first,last,email,
      profilePicUrl: s3Url + profilepicurl
    }
  })
}

module.exports.loginUser = function({email,password:plainTextPassword}){
  //here password passed in has been renamed to 'plainTextPassword'
  const query = 'SELECT id,first,last,email,password,profilepicurl FROM users WHERE email = $1'
  return db.query(query,[email])
  .then(function(userData){
    const {id:userId,first,last,email,password:hashedPassword,profilepicurl} = userData.rows[0]
    return {
      userId,first,last,email,hashedPassword,
      profilePicUrl: s3Url + profilepicurl
    }
  })
  .then(function({userId,first,last,email,hashedPassword,profilePicUrl}){
    //compare saved password with new one provided from user
    return checkPassword(plainTextPassword,hashedPassword)
    .then(function(doesMatch){
      if(!doesMatch){
        throw 'Passwords do not match!'
      }
      return {
        userId,first,last,email,profilePicUrl
      }
    })
  })
}

module.exports.updateProfilePic = function(userId,filename){
  const query = 'UPDATE users SET profilepicurl = $1 WHERE id = $2'
  return db.query(query,[filename,userId])
  .then(function(){
    return {
      profilePicUrl: s3Url + filename
    }
  })
}

module.exports.addTable = function(userId,name,description,filename){
  const query = 'INSERT INTO tables (user_id,name,description,tableurl) VALUES ($1,$2,$3,$4) RETURNING *'
  return db.query(query,[userId,name,description,filename])
  .then(function(dbTable){
    const {id,user_id:userId,name,description,tableurl,created_at:timestamp} = dbTable.rows[0]
    return {
      id,userId,name,description,timestamp,
      tableUrl: s3Url + tableurl
    }
  })
}

module.exports.getTables = function(){
  const query = 'SELECT * FROM tables'
  return db.query(query)
  .then(function(dbTables){
    return dbTables.rows.map(table=>{
      const {id,user_id:userId,name,description,tableurl,created_at:timestamp} = table
      return {
        id,userId,name,description,timestamp,
        tableUrl: s3Url + tableurl
      }
    })
  })
}

module.exports.getTableById = function(tableId){
  const query = 'SELECT * FROM tables WHERE id = $1'
  return db.query(query,[tableId])
  .then(function(dbTable){
    const {id,user_id:userId,name,description,tableurl,created_at:timestamp} = dbTable.rows[0]
    return {
      id,userId,name,description,timestamp,
      tableUrl: s3Url + tableurl
    }
  })
}


module.exports.createChart = function({userId,tableId,XAxis,YAxis,type,name,description}){
  const query = 'INSERT INTO charts (user_id,table_id,x_axis,y_axis,type,name,description) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id'
  return db.query(query,[userId,tableId,XAxis,YAxis,type,name,description])
  .then(function(dbChartId){
    const chartId = dbChartId.rows[0].id
    const query = `SELECT first, last, profilepicurl, charts.id, charts.table_id, charts.x_axis, charts.y_axis,charts.type, charts.name, charts.description, charts.created_at FROM users INNER JOIN charts ON users.id = charts.user_id WHERE charts.id = $1`
    return db.query(query,[chartId])
  })
  .then(function(dbChart){
    const {id,table_id:tableId,x_axis:XAxis,y_axis:YAxis,type,name,description,created_at:timestamp,first,last,profilepicurl} = dbChart.rows[0]
    return {
      id,tableId,XAxis,YAxis,type,name,description,timestamp,first,last,
      profilePicUrl: s3Url + profilepicurl
    }
  })
}

module.exports.getCharts = function(){
  const query = 'SELECT first, last, profilepicurl, charts.id, charts.table_id, charts.x_axis, charts.y_axis,charts.type, charts.name, charts.description, charts.created_at FROM users INNER JOIN charts ON users.id = charts.user_id LIMIT 20'
  return db.query(query)
  .then(function(dbCharts){
    return dbCharts.rows.map(chart=>{
      const {id,table_id:tableId,x_axis:XAxis,y_axis:YAxis,type,name,description,created_at:timestamp,first,last,profilepicurl} = chart
      return {
        id,tableId,XAxis,YAxis,type,name,description,timestamp,first,last,
        profilePicUrl: s3Url + profilepicurl
      }
    })
  })
}

module.exports.getChartById = function(chartId){
  const query = 'SELECT first, last, profilepicurl, charts.id, charts.table_id, charts.x_axis, charts.y_axis,charts.type, charts.name, charts.description, charts.created_at FROM users INNER JOIN charts ON users.id = charts.user_id WHERE charts.id = $1'
  return db.query(query,[chartId])
  .then(function(dbChart){
    const {id,table_id:tableId,x_axis:XAxis,y_axis:YAxis,type,name,description,created_at:timestamp,first,last,profilepicurl} = dbChart.rows[0]
    return {
      id,tableId,XAxis,YAxis,type,name,description,timestamp,first,last,
      profilePicUrl: s3Url + profilepicurl
    }
  })
}

module.exports.getCommentsByChartId = function(chartId){
  const query = `
    SELECT comment, comments.created_at,first,last,profilepicurl FROM comments
    RIGHT OUTER JOIN charts ON charts.id = comments.chart_id
    INNER JOIN users ON users.id = comments.user_id
    WHERE charts.id = $1`
  return db.query(query,[chartId])
  .then(function(dbComments){
    return dbComments.rows.map(dbComment=>{
      const {comment,created_at:timestamp,first,last,profilepicurl} = dbComment.rows[0]
      return {
        comment,timestamp,first,last,
        profilePicUrl: s3Url + profilepicurl
      }
    })
  })
}

module.exports.addChartComment = function(userId,chartId,comment){
  const query = 'INSERT INTO comments (user_id,chart_id,comment) VALUES ($1,$2,$3) RETURNING id'
  return db.query(query,[userId,chartId,comment])
  .then(function(dbCommentId){
    const {id:commentId} = dbCommentId.rows[0]
    const query = `
      SELECT comment, comments.created_at,first,last,profilepicurl FROM comments
      INNER JOIN users ON users.id = comments.user_id
      WHERE comments.id = $1`
    return db.query(query,[commentId])
  })
  .then(function(dbComment){
    const {comment,created_at:timestamp,first,last,profilepicurl} = dbComment.rows[0]
    return {
      comment,timestamp,first,last,
      profilePicUrl: s3Url + profilepicurl
    }
  })
}
