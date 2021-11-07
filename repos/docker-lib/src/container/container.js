const { dynamicCmd } = require('../cmds/dynamicCmd')
const { formatParams } = require('../utils/formatParams')

/**
 * Root docker container method to run docker container commands
 * @function
 * @param {Object} args - Options to pass to the docker container command
 * @param {string} args.item - Container name or id to run the command on
 * @param {string} args.opts - Options used to build the docker command
 * @param {string} args.format - Format of the docker command output
 *
 * @returns {string|Array} - Response from docker cli
 */
const container = (args) => {
  return dynamicCmd({
    ...formatParams('item', args),
    type: 'container',
  }, 'container')
}

module.exports = {
  container
}