const userMethods = require('./userMethods')
const tableMethods = require('./tableMethods')
const chartMethods = require('./chartMethods')


module.exports = {
  ...userMethods,
  ...tableMethods,
  ...chartMethods
}
