const express = require('express')
const app = express()

app.use(require('./build'))

app.listen(8001, ()=>console.log('ready to compile and server bundle.js'))
