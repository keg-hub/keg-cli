const { dynamicCmd } = require('../cmds/dynamicCmd')

/**
 * Root docker volume method to run docker volume commands
 * @function
 * @param {string} args - Arguments to pass to the docker volume command
 *
 * @returns {string|Array} - Response from docker cli
 */
const volume = (args={}) => dynamicCmd(args, 'volume')

module.exports = {
  volume
}
