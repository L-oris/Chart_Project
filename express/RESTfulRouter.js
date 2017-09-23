const express = require('express'),
      router = express.Router()

const {uploader,uploadToS3} = require('./middlewares')


//SEND BACK CSV TABLE CONVERTED TO JSON
const {readCsvFile} = require('../csv/methods')
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
