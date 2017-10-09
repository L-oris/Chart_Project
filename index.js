const express = require('express')
      app = express()

const {middlewares} = require('./express/middlewares'),
      userRouter = require('./express/userRouter'),
      tableRouter = require('./express/tableRouter'),
      chartRouter = require('./express/chartRouter'),
      mockRouter = require('./express/mockRouter')

if(process.env.NODE_ENV != 'production'){
  app.use('/bundle.js',require('http-proxy-middleware')({
    target: 'http://localhost:8001'
  }))
}



//apply middlewares
middlewares(app)

//serve static files
app.use(express.static('./public'))

//apply routes
app.use('/',userRouter)
app.use('/',tableRouter)
app.use('/',chartRouter)
app.use('/',mockRouter)


//serve React application
//(REDIRECT USER BASED ON HIS REGISTRATION STATUS)
app.get('*', function(req,res){
  if(!req.session.user && req.url !== '/welcome'){
    return res.redirect('/welcome')
  }
  res.sendFile(__dirname + '/index.html')
})


//handle 'Express' errors
app.use(function (err, req, res, next){
  console.log(`Server Error --> ${err}`)
  res.status(500).json({success:false})
})


const port = process.env.PORT || 8000
app.listen(port, function(){
  console.log(`Server listening on port ${port}`)
})
