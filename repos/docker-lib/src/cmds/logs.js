const { raw } = require('./raw')
const { Logger } = require('@keg-hub/cli-utils')
const { isArr } = require('@keg-hub/jsutils')

/**
 * Runs docker system prune command
 * @function
 * @param {Array|string} options - Options for the prune command
 *
 * @returns {*} - Response from the docker cli command
 */
 const log = (args, cmdArgs={}) => {
  const { opts, follow, container, item, log } = args

  // Get any previously set options
  const options = isArr(opts) ? opts : []

  // Add the container to be logged
  options.push(container || item)

  // Check if we should follow / tail the logs
  // Also check if follow has already been added
  follow &&
    !options.includes('-f') &&
    !options.includes('-follow') &&
    options.unshift('-f')

  const cmd = [ 'docker', 'logs' ].concat(options).join(' ')

  log && Logger.spacedMsg(`  Running command: `, cmd)

  return raw(cmd, cmdArgs)
}

module.exports = {
  log,
  logs: log
}