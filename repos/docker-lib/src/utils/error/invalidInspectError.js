const { Logger } = require('@keg-hub/cli-utils')
const { throwFailedCmd } = require('./throwFailedCmd')

/**
 * Throws an error when a docker type can not be found
 * @function
 * @param {string} message - Message for the thrown error
 *
 * @returns {void}
 */
 const invalidInspectError = (inspectData, error) => {
  Logger.empty()
  Logger.error(`Docker API command Inspect failed:`)
  Logger.info(`Inspect response must be of type object, Received:`, inspectData)
  Logger.empty()
  error && Logger.error(error.stack)
  Logger.empty()

  throwFailedCmd()
}

module.exports = {
  invalidInspectError
}