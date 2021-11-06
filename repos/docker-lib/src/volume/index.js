const { volume } = require('./volume')

// Add the sub-methods to the root docker volume method
module.exports = Object.assign(volume, {
  ...require('./list'),
})
