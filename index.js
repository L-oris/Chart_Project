const express = require('express')
const app = express()

const compression = require('compression')

app.use(compression())

if(process.env.NODE_ENV != 'production'){
  app.use('/bundle.js',require('http-proxy-middleware')({
    target: 'http://localhost:8001'
  }))
}

//serve static files
app.use(express.static('./public'))

//serve React application
app.get('*', function(req,res){
  res.sendFile(__dirname + '/index.html')
})

//handle 'Express' errors
app.use(function (err, req, res, next){
  console.log(`Error Handling Middleware --> ${err}`)
  res.status(500).json({success:false})
})

const port = 8000
app.listen(port, function(){
  console.log(`Server listening on port ${port}`)
})
