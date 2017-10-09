const express = require('express'),
      router = express.Router()

const {readCsvFile} = require('../csv/methods')



//MOCK-DATA--SEND BACK CSV TABLE CONVERTED TO JSON
router.get('/api/get_mock_table',function(req,res,next){
  readCsvFile('./mockDataSheets/mock_data.csv')
  .then(function(jsonTable){
    res.json(jsonTable)
  })
  .catch(function(err){
    next(`Error getting mock csv table`)
    console.log(`Error GET '/api/get_mock_table' --> ${err}`);
  })
})


//MOCK-DATA--SEND BACK MOCK DATA TO DISPLAY
router.get('/api/get_mock_data',function(req,res,next){
  readCsvFile('./mockDataSheets/mock_data.csv')
  .then(function(jsonData){
    const XData = jsonData.map(row=>row['Year'])
    const YData = jsonData.map(row=>row['Life expectancy birth'])
    res.json({XData,YData})
  })
  .catch(function(err){
    next(`Error getting mock csv table`)
    console.log(`Error GET '/api/get_mock_data' --> ${err}`);
  })
})


module.exports = router
