const { get } = require('./get')
const { container } = require('./container')
const { containerCmds, ...cmds } = require('./containerCmd')

// Add the sub-methods to the root docker image method
module.exports = Object.assign(container, {
  ...containerCmds,
  ...require('./clean'),
  ...require('./commit'),
  ...require('./copy'),
  ...require('./destroy'),
  ...require('./exec'),
  ...require('./exists'),
  ...require('./get'),
  ...require('./inspect'),
  ...require('./list'),
  ...require('./port'),
  ...require('./ps'),
  ...require('./remove'),
  get,
})
