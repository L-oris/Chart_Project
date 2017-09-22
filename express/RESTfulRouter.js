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

module.exports = router
