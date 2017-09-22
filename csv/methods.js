const csv = require('csvtojson')

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
