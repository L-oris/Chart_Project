const express = require('express'),
      router = express.Router()

const {readCsvFile,readCsvFileByUrl} = require('../csv/methods')
const {uploader,uploadToS3} = require('./middlewares')
const {
  createUser,
  loginUser,
  addTable,
  getTables,
  getTableById,
  createChart,
  getCharts,
  getChartById,
  getDataByChartId,
  getCommentsByChartId,
  addChartComment
} = require('../database/methods')



//CREATE NEW USER INTO DATABASE
router.post('/api/register', function(req,res,next){
  const {first,last,email,password} = req.body
  if(!(first&&last&&email&&password)){
    throw 'Not all fields provided for registering a new user'
  }
  createUser(req.body)
  .then(function(userData){
    //set user info inside session
    req.session.user = userData
    res.json({success:true})
  })
  .catch(function(err){
    next('Error happened adding user to database')
  })
})

//CHECK FOR ALREADY REGISTERED USER
router.post('/api/login', function(req,res,next){
  const {email,password} = req.body
  if(!(email&&password)){
    throw 'Not all fields provided for logging in the user'
  }
  loginUser(req.body)
  .then(function(userData){
    //set user info inside session
    req.session.user = userData
    res.json({success:true})
  })
  .catch(function(err){
    next('User not found')
  })
})

//GET LOGGED-IN USER'S INFO (FROM SESSION)
router.get('/api/get_current_user',function(req,res){
  if(!req.session.user){
    throw 'No logged in user in current session'
  }
  res.json(req.session.user)
})

//LOGOUT USER
router.get('/api/logout',function(req,res){
  req.session = null
  res.redirect('/welcome')
})



//UPLOAD CSV TABLE TO AWS S3
router.post('/api/upload_table',uploader.single('file'),uploadToS3,function(req,res,next){
  const {name,description} = req.body
  const {filename} = req.file
  const {userId} = req.session.user
  addTable(userId,name,description,filename)
  .then(function(newTable){
    res.json(newTable)
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


//SEND BACK FIRST 4 ROWS OF REQUESTED TABLE
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
  })
})


//CREATE NEW CHART INTO DATABASE
router.post('/api/create_chart',function(req,res,next){
  //const {tableId,XAxis,YAxis,type,name,description} = req.body
  const {userId} = req.session.user
  createChart({...req.body,userId})
  .then(function(newChart){
    res.json(newChart)
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

//SEND BACK SELECTED CHART INFO
router.get('/api/get_chart/:chartId',function(req,res,next){
  const {chartId} = req.params
  getChartById(chartId)
  .then(function(chartData){
    res.json(chartData)
  })
  .catch(function(err){
    next(`Error retrieving chart #${chartId}`)
  })
})

//SEND BACK DATA TO DISPLAY INSIDE CHART
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
  })
})

//SEND BACK DATA TO DISPLAY INSIDE CHART
// don't search for existing chart into database now, instead just pass options inside req.body and retrieve requested data to display
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
  })
})









// //MOCK-DATA--SEND BACK CSV TABLE CONVERTED TO JSON
// router.get('/api/get_table',function(req,res,next){
//   readCsvFile('./dataSheets/mock_data.csv')
//   .then(function(jsonTable){
//     res.json(jsonTable)
//   })
//   .catch(function(err){
//     next(`Error converting csv table  to json`)
//   })
// })
//
// //MOCK-DATA--SEND BACK MOCK DATA TO DISPLAY
// router.get('/api/get_data',function(req,res,next){
//   readCsvFile('./dataSheets/mock_data.csv')
//   .then(function(jsonData){
//     const XData = jsonData.map(row=>row['Year'])
//     const YData = jsonData.map(row=>row['Life expectancy birth'])
//     res.json({XData,YData})
//   })
// })

module.exports = router
