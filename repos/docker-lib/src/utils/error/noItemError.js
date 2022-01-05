const { Logger } = require('@keg-hub/cli-utils')
const { throwFailedCmd } = require('./throwFailedCmd')


/**
 * Throws an error when no item argument is passed to a docker command
 * @function
 * @param {string} cmd - Docker command that requires an item argument
 * @param {boolean} [shouldThrow=false] - Should an error be throw
 *
 * @returns {boolean} If shouldThrow is false, then return false.
 */
 const noItemError = (cmd, shouldThrow=false) => {
  Logger.empty()
  Logger.error(`  Docker API command failed:`)
  Logger.info(`  The "${ cmd }" command requires an object argument with an item key to run!`)
  Logger.empty()

  if(!shouldThrow) return false
  
  throwFailedCmd()
}

module.exports = {
  noItemError
}