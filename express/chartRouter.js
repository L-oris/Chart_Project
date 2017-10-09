const express = require('express'),
      router = express.Router()

const {readCsvFileByUrl} = require('../csv/methods')
const {uploader,uploadToS3} = require('./middlewares')
const {
  getTableById,
  createChart,
  getCharts,
  getChartById,
  getChartsByUserId,
  getDataByChartId,
  searchChart,
  getCommentsByChartId,
  addChartComment
} = require('../database/methods')



//CREATE NEW CHART INTO DATABASE
router.post('/api/create_chart',uploader.single('file'),uploadToS3,function(req,res,next){
  //const {tableId,XAxis,YAxis,type,name,description} = req.body
  const {filename} = req.file
  if(!filename){
    throw 'No file to upload'
  }
  const {userId} = req.session.user
  createChart({...req.body,userId,filename})
  .then(function(newChart){
    res.json(newChart)
  })
  .catch(function(err){
    console.log(`Error POST '/api/create_chart' --> ${err}`);
    next(`Error creating new chart into database`)
  })
})


//SEND BACK DATABASE CHARTS LIST (LAST 20 UPLOADED)
router.get('/api/get_charts',function(req,res,next){
  getCharts()
  .then(function(chartsArr){
    res.json(chartsArr)
  })
  .catch(function(err){
    next('Error retrieving charts list from database')
    console.log(`Error GET '/api/get_charts' --> ${err}`);
  })
})


//GET ALL CHARTS OWNED BY USER
router.get('/api/get_user_charts',function(req,res,next){
  const {userId} = req.session.user
  getChartsByUserId(userId)
  .then(function(chartsArr){
    res.json(chartsArr)
  })
  .catch(function(err){
    next(`Error getting charts of user #${userId}`)
    console.log(`Error GET '/api/get_user_charts' --> ${err}`);
  })
})


//SEND BACK SELECTED CHART INFO
router.get('/api/get_chart/:chartId',function(req,res,next){
  const {chartId} = req.params
  getChartById(chartId)
  .then(function(chartData){
    res.json(chartData)
  })
  .catch(function(err){
    next(`Error retrieving chart #${chartId}`)
    console.log(`Error GET '/api/get_chart/:chartId' --> ${err}`);
  })
})


//SEND BACK DATA TO DISPLAY INSIDE ALREADY EXISTING CHART
router.get('/api/get_chart_data/:chartId',function(req,res,next){
  const {chartId} = req.params
  let _XAxis, _YAxis
  getChartById(chartId)
  .then(function({tableId,XAxis,YAxis}){
    _XAxis = XAxis
    _YAxis = YAxis
    return getTableById(tableId)
  })
  .then(function({tableUrl}){
    return readCsvFileByUrl(tableUrl)
  })
  .then(function(jsonData){
    const XData = jsonData.map(row=>row[_XAxis])
    const YData = jsonData.map(row=>row[_YAxis])
    res.json({XData,YData})
  })
  .catch(function(err){
    next(`Error retrieving chart data`)
    console.log(`Error GET '/api/get_chart_data/:chartId' --> ${err}`);
  })
})


//SEND BACK DATA TO DISPLAY INSIDE NOT YET EXISTING CHART
// doesn't search for existing chart into database now, instead options are passed inside HTTP POST request
router.post('/api/get_unsaved_chart_data',function(req,res,next){
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
    next(`Error retrieving chart data`)
    console.log(`Error POST '/api/get_unsaved_chart_data' --> ${err}`);
  })
})


//SEARCH FOR CHARTS, GIVE BACK MAXIMUM 4 RESULTS
router.post('/api/search_chart',function(req,res,next){
  const {searchType,searchText} = req.body
  searchChart(searchType,searchText)
  .then(function(chartsArr){
    res.json(chartsArr)
  })
  .catch(function(err){
    next('Error searching for charts')
    console.log(`Error POST '/api/search_chart' --> ${err}`);
  })
})


//SEND BACK COMMENTS FOR SELECTED CHART
router.get('/api/get_chart_comments/:chartId',function(req,res,next){
  const {chartId} = req.params
  getCommentsByChartId(chartId)
  .then(function(commentsArr){
    res.json(commentsArr)
  })
  .catch(function(err){
    next(`Error retrieving comments for chart #${chartId}`)
    console.log(`Error GET '/api/get_chart_comments/:chartId' --> ${err}`);
  })
})


//ADD NEW COMMENT FOR SELECTED CHART
router.post('/api/add_chart_comment',function(req,res,next){
  const {chartId,comment} = req.body
  const {userId} = req.session.user
  addChartComment(userId,chartId,comment)
  .then(function(newComment){
    res.json(newComment)
  })
  .catch(function(err){
    next(`Error adding new comment for chart #${chartId}`)
    console.log(`Error POST '/api/addChartComment' --> ${err}`);
  })
})


module.exports = router
