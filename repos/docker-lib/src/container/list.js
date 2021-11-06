const { isStr } = require('@keg-hub/jsutils')
const { containerCmd } = require('./containerCmd')

/**
 * Calls the docker api and gets a list of current containers
 * @function
 * @param {Object} args - Arguments used to modify the docker api call
 * @param {string} args.opts - Options used to build the docker command
 * @param {string} args.format - Format of the docker command output
 *
 * @returns {Array} - JSON array of containers
 */
 const list = (args={}) => {
  const opts = isStr(args) ? { item: args, type: 'container' } : args
  return containerCmd({ format: 'json', ...opts }, [ 'ls', '-a' ])
}

module.exports = {
  list
}