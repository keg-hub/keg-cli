const { get } = require('./get')
const { image } = require('./image')

// Add the sub-methods to the root docker image method
module.exports = Object.assign(image, {
  ...require('./clean'),
  ...require('./exists'),
  ...require('./getCmd'),
  ...require('./inspect'),
  ...require('./list'),
  ...require('./remove'),
  ...require('./run'),
  ...require('./tag'),
  get,
})
