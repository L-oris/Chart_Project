const express = require('express'),
      router = express.Router()

const {readCsvFileByUrl} = require('../csv/methods')
const {uploader,uploadToS3} = require('./middlewares')
const {
  addTable,
  getTables,
  getTableById,
  getTablesByUserId,
  searchTable,
} = require('../database/methods')



//UPLOAD NEW CSV TABLE TO AWS S3
router.post('/api/upload_table',uploader.single('file'),uploadToS3,function(req,res,next){
  const {name,description} = req.body
  const {filename} = req.file
  if(!filename){
    throw 'No file to upload'
  }
  const {userId} = req.session.user
  addTable(userId,name,description,filename)
  .then(function(newTable){
    res.json(newTable)
  })
  .catch(function(err){
    next('error happened adding new table into database')
    console.log(`Error POST '/api/upload_table' --> ${err}`);
  })
})


//SEND BACK DATABASE TABLES LIST (LAST 20 UPLOADED)
router.get('/api/get_tables',function(req,res,next){
  getTables()
  .then(function(tablesArr){
    res.json(tablesArr)
  })
  .catch(function(err){
    next(`Error converting csv table  to json`)
    console.log(`Error GET '/api/get_tables' --> ${err}`);
  })
})


//GET ALL TABLES OWNED BY USER
router.get('/api/get_user_tables',function(req,res,next){
  const {userId} = req.session.user
  getTablesByUserId(userId)
  .then(function(tablesArr){
    res.json(tablesArr)
  })
  .catch(function(err){
    next(`Error getting tables of user #${userId}`)
    console.log(`Error GET '/api/get_user_tables' --> ${err}`);
  })
})


//SEND BACK SELECTED TABLE INFO
router.get('/api/get_table/:tableId',function(req,res,next){
  const {tableId} = req.params
  getTableById(tableId)
  .then(function(tableData){
    res.json(tableData)
  })
  .catch(function(err){
    next(`Error retrieving table #${tableId}`)
    console.log(`Error GET '/api/get_table/:tableId' --> ${err}`);
  })
})


//SEND BACK FIRST 4 ROWS OF DATA FOR REQUESTED TABLE
router.get('/api/get_table_preview/:tableId',function(req,res,next){
  getTableById(req.params.tableId)
  .then(function({tableUrl}){
    return readCsvFileByUrl(tableUrl)
  })
  .then(function(jsonData){
    res.json(jsonData.slice(0,4))
  })
  .catch(function(err){
    next(`Error getting json preview of table #${tableId}`)
    console.log(`Error GET '/api/get_table_preview/:tableId' --> ${err}`);
  })
})


//SEND BACK AVAILABLE TABLE FIELDS --> (FOR CHART CREATOR)
router.get('/api/get_table_fields/:tableId',function(req,res,next){
  getTableById(req.params.tableId)
  .then(function({tableUrl}){
    return readCsvFileByUrl(tableUrl)
  })
  .then(function(jsonData){
    res.json(Object.keys(jsonData[0]))
  })
  .catch(function(err){
    next(`Error getting available fields`)
    console.log(`Error GET '/api/get_table_fields/:tableId' --> ${err}`);
  })
})


//SEARCH FOR TABLES, GIVE BACK MAXIMUM 4 RESULTS
router.post('/api/search_table',function(req,res,next){
  const {searchType,searchText} = req.body
  searchTable(searchType,searchText)
  .then(function(tablesArr){
    res.json(tablesArr)
  })
  .catch(function(err){
    next('Error searching for tables')
    console.log(`Error POST '/api/search_table' --> ${err}`);
  })
})


module.exports = router
