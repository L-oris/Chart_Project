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
    const {id:user_id,first,last,email,profilepicurl} = userData.rows[0]
    return {
      user_id,first,last,email,
      profilePicUrl: s3Url + profilepicurl
    }
  })
}

module.exports.loginUser = function({email,password:plainTextPassword}){
  //here password passed in has been renamed to 'plainTextPassword'
  const query = 'SELECT id,first,last,email,password,profilepicurl FROM users WHERE email = $1'
  return db.query(query,[email])
  .then(function(userData){
    const {id:user_id,first,last,email,password:hashedPassword,profilepicurl} = userData.rows[0]
    return {
      user_id,first,last,email,hashedPassword,
      profilePicUrl: s3Url + profilepicurl
    }
  })
  .then(function({user_id,first,last,email,hashedPassword,profilePicUrl}){
    //compare saved password with new one provided from user
    return checkPassword(plainTextPassword,hashedPassword)
    .then(function(doesMatch){
      if(!doesMatch){
        throw 'Passwords do not match!'
      }
      return {
        user_id,first,last,email,profilePicUrl
      }
    })
  })
}


module.exports.addTable = function(name,description,filename){
  const query = 'INSERT INTO tables (user_id,name,description,tableurl) VALUES (1,$1,$2,$3)'
  return db.query(query,[name,description,filename])
}

module.exports.getTables = function(){
  const query = 'SELECT * FROM tables'
  return db.query(query)
  .then(function(dbTables){
    return dbTables.rows.map(table=>{
      const {id,user_id,name,description,tableurl,created_at} = table
      return {
        id,user_id,name,description,created_at,
        tableUrl: s3Url+tableurl
      }
    })
  })
}

module.exports.getTableById = function(tableId){
  const query = 'SELECT * FROM tables WHERE id = $1'
  return db.query(query,[tableId])
  .then(function(dbTable){
    return {
      id: dbTable.rows[0].id,
      user_id: dbTable.rows[0].user_id,
      name: dbTable.rows[0].name,
      description: dbTable.rows[0].description,
      tableUrl: s3Url + dbTable.rows[0].tableurl,
      timestamp: dbTable.rows[0].created_at
    }
  })
}

module.exports.createChart = function({tableId,XAxis,YAxis,type,name,description}){
  const query = 'INSERT INTO charts (user_id,table_id,x_axis,y_axis,type,name,description) VALUES (1,$1,$2,$3,$4,$5,$6) RETURNING id'
  return db.query(query,[tableId,XAxis,YAxis,type,name,description])
  .then(function(dbChartId){
    const chartId = dbChartId.rows[0].id
    const query = `SELECT first, last, profilepicurl, charts.id, charts.table_id, charts.x_axis, charts.y_axis,charts.type, charts.name, charts.description, charts.created_at FROM users INNER JOIN charts ON users.id = charts.user_id WHERE charts.id = $1`
    return db.query(query,[chartId])
  })
  .then(function(dbChart){
    return {
      id: dbChart.rows[0].id,
      tableId: dbChart.rows[0].table_id,
      XAxis: dbChart.rows[0].x_axis,
      YAxis: dbChart.rows[0].y_axis,
      type: dbChart.rows[0].type,
      name: dbChart.rows[0].name,
      description: dbChart.rows[0].description,
      timestamp: dbChart.rows[0].created_at,
      first: dbChart.rows[0].first,
      last: dbChart.rows[0].last,
      profilePicUrl: dbChart.rows[0].profilepicurl
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
        profilePicUrl: profilepicurl
      }
    })
  })
}

module.exports.getChartById = function(chartId){
  const query = 'SELECT first, last, profilepicurl, charts.id, charts.table_id, charts.x_axis, charts.y_axis,charts.type, charts.name, charts.description, charts.created_at FROM users INNER JOIN charts ON users.id = charts.user_id where charts.id = $1'
  return db.query(query,[chartId])
  .then(function(dbChart){
    const {id,table_id:tableId,x_axis:XAxis,y_axis:YAxis,type,name,description,created_at:timestamp,first,last,profilepicurl} = dbChart.rows[0]
    return {
      id,tableId,XAxis,YAxis,type,name,description,timestamp,first,last,
      profilePicUrl: profilepicurl
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
      const {comment,created_at:timestamp,first,last,profilepicurl:profilePicUrl} = dbComment
      return {
        comment,timestamp,first,last,profilePicUrl
      }
    })
  })
}

module.exports.addChartComment = function(chartId,comment){
  const query = 'INSERT INTO comments (user_id,chart_id,comment) VALUES (1,$1,$2) RETURNING id'
  return db.query(query,[chartId,comment])
  .then(function(dbCommentId){
    const query = `
      SELECT comment, comments.created_at,first,last,profilepicurl FROM comments
      INNER JOIN users ON users.id = comments.user_id
      WHERE comments.id = $1`
    return db.query(query,[dbCommentId.rows[0].id])
  })
  .then(function(dbComment){
    const {comment,created_at:timestamp,first,last,profilepicurl:profilePicUrl} = dbComment.rows[0]
    return {
      comment,timestamp,first,last,profilePicUrl
    }
  })
}
