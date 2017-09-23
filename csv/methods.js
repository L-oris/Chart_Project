const csv = require('csvtojson')
const request = require('request')


module.exports.readCsvFile = function(pathToFile){
  return new Promise(function(resolve,reject){
    let finalJson = []
    csv()
    .fromFile(pathToFile)
    .on('json',(jsonObj)=>{
      finalJson.push(jsonObj)
    })
    .on('end',()=>{
      resolve(finalJson)
    })
  })
}

module.exports.readCsvFileByUrl = function(urlToFile){
  return new Promise(function(resolve,reject){
    let finalJson = []
    csv()
    .fromStream(request.get(urlToFile))
    .on('json',(jsonObj)=>{
      finalJson.push(jsonObj)
    })
    .on('end',(err)=>{
      resolve(finalJson)
      reject(err)
    })
  })
}
