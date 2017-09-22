const express = require('express'),
      router = express.Router()

const {uploader,uploadToS3} = require('./middlewares')

router.get('/api/test',function(req,res,next){
  res.json({success:true})
})

module.exports = router
