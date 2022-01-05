const { dynamicCmd } = require('../cmds/dynamicCmd')

/**
 * Root docker image method to run docker image commands
 * @function
 * @param {string} args - Arguments to pass to the docker image command
 *
 * @returns {string|Array} - Response from docker cli
 */
const image = (args={}) => dynamicCmd(args, 'image')

module.exports = {
  image
}
