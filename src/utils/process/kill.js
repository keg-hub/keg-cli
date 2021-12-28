const { Logger } = require('@keg-hub/cli-utils')
const { asyncCmd } = require('@keg-hub/spawn-cmd')
const { generalError } = require('KegUtils/error')

/**
 * Attempts to kill the process identified by pid
 * @param {string} pid - process id
 */
const kill = async pid => {
  (!pid || pid <= 0) && generalError(`Kill() expects pid to be positive. Found: ${pid}`)
  
  const { error } = await asyncCmd(
    `kill -9 ${pid}`,
    {} 
  )

  error
    ? generalError(error)
    : Logger.info('Process killed.')
}

module.exports = { kill }