const db = require('./db');
const {hashPassword,checkPassword} = require('./hashing')
const {s3Url} = require('../config/config.json')


module.exports.addTable = function(name,description,filename){
  const query = 'INSERT INTO tables (user_id,name,description,tableurl) VALUES (1,$1,$2,$3)'
  return db.query(query,[name,description,filename])
}
