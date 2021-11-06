const { Logger } = require('@keg-hub/cli-utils')
const { throwFailedCmd } = require('./throwFailedCmd')


/**
 * Throws an error when a docker type can not be found
 * @function
 * @param {string} message - Message for the thrown error
 *
 * @returns {void}
 */
 const noItemFoundError = (type, name) => {
  Logger.empty()
  Logger.error(`Docker API command failed:`)
  Logger.info(`Could not find docker ${type} from ${ name }!`)
  Logger.empty()

  throwFailedCmd()
}

module.exports = {
  noItemFoundError
}