const express = require('express'),
      router = express.Router()

const {readCsvFile,readCsvFileByUrl} = require('../csv/methods')
const {uploader,uploadToS3} = require('./middlewares')
const {addTable,getTables,getTableById,createChart,getCharts,getCommentsByChartId} = require('../database/methods')



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


//SEND BACK DATABASE TABLES LIST
router.get('/api/get_tables',function(req,res,next){
  getTables()
  .then(function(tablesArr){
    res.json(tablesArr)
  })
  .catch(function(err){
    next(`Error converting csv table  to json`)
  })
})


//SEND BACK AVAILABLE FIELDS FOR CHART CREATOR
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
  })
})


//CREATE NEW CHART INTO DATABASE
router.post('/api/create_chart',function(req,res,next){
  //const {tableId,XAxis,YAxis,type,name,description} = req.body
  createChart(req.body)
  .then(function(dbChart){
    res.json(dbChart)
  })
  .catch(function(err){
    next(`Error creating new chart into database`)
  })
})

//SEND BACK DATABASE CHARTS LIST
router.get('/api/get_charts',function(req,res,next){
  getCharts()
  .then(function(chartsArr){
    res.json(chartsArr)
  })
  .catch(function(err){
    next('Error retrieving charts list from database')
  })
})

//SEND BACK DATA TO DISPLAY INSIDE CHART
router.post('/api/get_chart_data',function(req,res,next){
  const {tableId,XAxis,YAxis} = req.body
  getTableById(tableId)
  .then(function({tableUrl}){
    return readCsvFileByUrl(tableUrl)
  })
  .then(function(jsonData){
    const XData = jsonData.map(row=>row[XAxis])
    const YData = jsonData.map(row=>row[YAxis])
    res.json({XData,YData})
  })
  .catch(function(err){
    next(`Error sending back chart data`)
  })
})

//SEND BACK COMMENTS FOR SELECTED CHART
router.post('/api/get_chart_comments',function(req,res,next){
  const {chartId} = req.body
  getCommentsByChartId(chartId)
  .then(function(commentsArr){
    res.json(commentsArr)
  })
  .catch(function(err){
    next(`Error retrieving comments for chart #${chartId}`)
  })
})









//MOCK-DATA--SEND BACK CSV TABLE CONVERTED TO JSON
router.get('/api/get_table',function(req,res,next){
  readCsvFile('./dataSheets/mock_data.csv')
  .then(function(jsonTable){
    res.json(jsonTable)
  })
  .catch(function(err){
    next(`Error converting csv table  to json`)
  })
})

//MOCK-DATA--SEND BACK MOCK DATA TO DISPLAY
router.get('/api/get_data',function(req,res,next){
  readCsvFile('./dataSheets/mock_data.csv')
  .then(function(jsonData){
    const XData = jsonData.map(row=>row['Year'])
    const YData = jsonData.map(row=>row['Life expectancy birth'])
    res.json({XData,YData})
  })
})

module.exports = router
