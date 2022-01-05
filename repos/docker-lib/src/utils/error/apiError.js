const { Logger } = require('@keg-hub/cli-utils')
const { isObj, isStr, toStr } = require('@keg-hub/jsutils')

const NEWLINES_MATCH = /\n|\r|\r\n/

/**
 * Error logger for docker commands. Logs the passed in error, then exits
 * @param {string} error - The error to be logged
 * @param {*} errResponse - Response to return after logging the error.
 *                          Exists the process it errResponse is falsy
 *
 * @returns {*} - Passed in errResponse
 */
 const apiError = (error, errResponse, skipError) => {

  // Check if we should skip logging the error
  if(skipError) return errResponse

  const toLog = isStr(error)
    ? error
    : isObj(error) && error.stack
      ? error.stack
      : toStr(error)

  Logger.empty()
  Logger.error(`Docker Api Error:`)
  Logger.error(``, toLog.split(NEWLINES_MATCH).join('\n  '))
  Logger.empty()


  // If the errResponse is not undefined, return it... otherwise exit the process!
  return errResponse !== undefined  ? errResponse : process.exit(1)
}

module.exports = {
  apiError
}