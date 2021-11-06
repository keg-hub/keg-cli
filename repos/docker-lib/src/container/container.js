const { isStr } = require('@keg-hub/jsutils')
const { dynamicCmd } = require('../cmds/dynamicCmd')


/**
 * Root docker container method to run docker container commands
 * @function
 * @param {Object} args - Options to pass to the docker container command
 * @param {string} args.opts - Options used to build the docker command
 * @param {string} args.format - Format of the docker command output
 *
 * @returns {string|Array} - Response from docker cli
 */
const container = (args={}) => dynamicCmd(
  { type: 'container', ...(isStr(args) ? { item: args } : args) },
  'container'
)

module.exports = {
  container
}