const db = require('./db');
const {hashPassword,checkPassword} = require('./hashing')
const {s3Url} = require('../config/config.json')


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
