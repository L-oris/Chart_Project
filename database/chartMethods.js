const db = require('./db');
const {hashPassword,checkPassword} = require('./hashing')

//use 2 different AWS buckets for development & production mode
let s3Url = require('../config/config.json').s3UrlDev
if(process.env.NODE_ENV==='production'){
  s3Url = require('../config/config.json').s3Url
}
const defaultImageUrl = 'profile-default.jpg'
const defaultProfileBackgroundUrl = 'profile-bg.jpg'



module.exports.createChart = function({userId,tableId,XAxis,YAxis,type,name,description,filename}){
  const query = `
    INSERT INTO charts (user_id,table_id,x_axis,y_axis,type,name,description,chartpicurl)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    RETURNING id`
  return db.query(query,[userId,tableId,XAxis,YAxis,type,name,description,filename])
  .then(function(dbChartId){
    const chartId = dbChartId.rows[0].id
    const query = `
      SELECT comments.number AS comments_number, first, last, profilepicurl, charts.id, charts.table_id, charts.x_axis, charts.y_axis,charts.type, charts.name, charts.description, chartpicurl, charts.created_at
      FROM users
      INNER JOIN charts ON users.id = charts.user_id
      LEFT OUTER JOIN (SELECT COUNT(*) AS number, chart_id
                  FROM comments
                  GROUP BY chart_id) AS comments ON charts.id = comments.chart_id
      WHERE charts.id = $1`
    return db.query(query,[chartId])
  })
  .then(function(dbChart){
    const {id,table_id:tableId,x_axis:XAxis,y_axis:YAxis,type,name,description,chartpicurl,created_at:timestamp,first,last,profilepicurl,comments_number:commentsNumber} = dbChart.rows[0]
    return {
      id,tableId,XAxis,YAxis,type,name,description,timestamp,first,last,
      commentsNumber: commentsNumber || 0,
      profilePicUrl: s3Url + profilepicurl,
      chartPicUrl: s3Url + chartpicurl
    }
  })
}


module.exports.getCharts = function(){
  const query = `
    SELECT comments.number AS comments_number, first, last, profilepicurl, charts.id, charts.table_id, charts.x_axis, charts.y_axis,charts.type, charts.name, charts.description, chartpicurl, charts.created_at
    FROM users
    INNER JOIN charts ON users.id = charts.user_id
    LEFT OUTER JOIN (SELECT COUNT(*) AS number, chart_id
                FROM comments
                GROUP BY chart_id) AS comments ON charts.id = comments.chart_id
    ORDER BY created_at DESC LIMIT 20`
  return db.query(query)
  .then(function(dbCharts){
    return dbCharts.rows.map(chart=>{
      const {id,table_id:tableId,x_axis:XAxis,y_axis:YAxis,type,name,description,chartpicurl,created_at:timestamp,first,last,profilepicurl,comments_number:commentsNumber} = chart
      return {
        id,tableId,XAxis,YAxis,type,name,description,timestamp,first,last,
        commentsNumber: commentsNumber || 0,
        profilePicUrl: s3Url + profilepicurl,
        chartPicUrl: s3Url + chartpicurl
      }
    })
  })
}


module.exports.getChartById = function(chartId){
  const query = `
    SELECT comments.number AS comments_number, first, last, profilepicurl, charts.id, charts.table_id, charts.x_axis, charts.y_axis,charts.type, charts.name, charts.description, chartpicurl, charts.created_at
    FROM users
    INNER JOIN charts ON users.id = charts.user_id
    LEFT OUTER JOIN (SELECT COUNT(*) AS number, chart_id
                FROM comments
                GROUP BY chart_id) AS comments ON charts.id = comments.chart_id
    WHERE charts.id = $1`
  return db.query(query,[chartId])
  .then(function(dbChart){
    const {id,table_id:tableId,x_axis:XAxis,y_axis:YAxis,type,name,description,chartpicurl,created_at:timestamp,first,last,profilepicurl,comments_number:commentsNumber} = dbChart.rows[0]
    return {
      id,tableId,XAxis,YAxis,type,name,description,timestamp,first,last,
      commentsNumber: commentsNumber || 0,
      profilePicUrl: s3Url + profilepicurl,
      chartPicUrl: s3Url + chartpicurl
    }
  })
}


module.exports.getChartsByUserId = function(userId){
  const query = `
    SELECT comments.number AS comments_number, first, last, profilepicurl, charts.id, charts.table_id, charts.x_axis, charts.y_axis,charts.type, charts.name, charts.description, chartpicurl, charts.created_at
    FROM users
    INNER JOIN charts ON users.id = charts.user_id
    LEFT OUTER JOIN (SELECT COUNT(*) AS number, chart_id
                FROM comments
                GROUP BY chart_id) AS comments ON charts.id = comments.chart_id
    WHERE users.id = $1
    ORDER BY created_at DESC`
  return db.query(query,[userId])
  .then(function(dbCharts){
    return dbCharts.rows.map(chart=>{
      const {id,table_id:tableId,x_axis:XAxis,y_axis:YAxis,type,name,description,chartpicurl,created_at:timestamp,first,last,profilepicurl,comments_number:commentsNumber} = chart
      return {
        id,tableId,XAxis,YAxis,type,name,description,timestamp,first,last,
        commentsNumber: commentsNumber || 0,
        profilePicUrl: s3Url + profilepicurl,
        chartPicUrl: s3Url + chartpicurl
      }
    })
  })
}


module.exports.searchChart = function(searchType,searchText){
  let query = `
    SELECT comments.number AS comments_number, first, last, profilepicurl, charts.id, charts.table_id, charts.x_axis, charts.y_axis,charts.type, charts.name, charts.description, chartpicurl, charts.created_at
    FROM users
    INNER JOIN charts ON users.id = charts.user_id
    LEFT OUTER JOIN (SELECT COUNT(*) AS number, chart_id
                FROM comments
                GROUP BY chart_id) AS comments ON charts.id = comments.chart_id `
  if(searchType === 'name'){
    query += 'WHERE charts.name ILIKE $1'
    searchText = '%' + searchText + '%'
  } else if(searchType === 'type'){
    query += 'WHERE charts.type ILIKE $1'
    searchText = '%' + searchText + '%'
  } else if(searchType === 'user'){
    query += 'WHERE users.first ILIKE $1 OR users.last ILIKE $1'
    searchText = searchText + '%'
  }
  query += ' ORDER BY created_at DESC LIMIT 4'

  return db.query(query,[searchText])
  .then(function(dbCharts){
    return dbCharts.rows.map(chart=>{
      const {id,table_id:tableId,x_axis:XAxis,y_axis:YAxis,type,name,description,chartpicurl,created_at:timestamp,first,last,profilepicurl,comments_number:commentsNumber} = chart
      return {
        id,tableId,XAxis,YAxis,type,name,description,timestamp,first,last,
        commentsNumber: commentsNumber || 0,
        profilePicUrl: s3Url + profilepicurl,
        chartPicUrl: s3Url + chartpicurl
      }
    })
  })
}


module.exports.getCommentsByChartId = function(chartId){
  const query = `
    SELECT comment, comments.created_at,first,last,profilepicurl FROM comments
    RIGHT OUTER JOIN charts ON charts.id = comments.chart_id
    INNER JOIN users ON users.id = comments.user_id
    WHERE charts.id = $1
    ORDER BY created_at DESC LIMIT 10`
  return db.query(query,[chartId])
  .then(function(dbComments){
    return dbComments.rows.map(dbComment=>{
      const {comment,created_at:timestamp,first,last,profilepicurl} = dbComment
      return {
        comment,timestamp,first,last,
        profilePicUrl: s3Url + profilepicurl
      }
    })
  })
}


module.exports.addChartComment = function(userId,chartId,comment){
  const query = `
    INSERT INTO comments (user_id,chart_id,comment)
    VALUES ($1,$2,$3)
    RETURNING id`
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
