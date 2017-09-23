const express = require('express'),
      router = express.Router()

const {readCsvFile} = require('../csv/methods')
const {uploader,uploadToS3} = require('./middlewares')
const {addTable} = require('../database/methods')



//UPLOAD CSV TABLE TO AWS S3
router.post('/api/upload_table',uploader.single('file'),uploadToS3,function(req,res,next){
  const {name,description} = req.body
  const {filename} = req.file
  addTable(name,description,filename)
  .then(function(){
    res.json({success:true})
  })
  .catch(function(err){
    next('error happened adding new table into database')
  })
})


//SEND BACK CSV TABLE CONVERTED TO JSON
router.get('/api/get_table',function(req,res,next){
  readCsvFile('./dataSheets/mock_data.csv')
  .then(function(jsonTable){
    res.json(jsonTable)
  })
  .catch(function(err){
    next(`Error converting csv table  to json`)
  })
})


//SEND BACK MOCK DATA TO DISPLAY
router.get('/api/get_data',function(req,res,next){
  readCsvFile('./dataSheets/mock_data.csv')
  .then(function(jsonData){
    const XData = jsonData.map(row=>row['Year'])
    const YData = jsonData.map(row=>row['Life expectancy birth'])
    res.json({XData,YData})
  })
})

module.exports = router
