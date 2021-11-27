const { removeCmd } = require('../cmds/remove')

/**
 * Removes a docker image based on passed in toRemove argument
 * @function
 * @param {string} args - Arguments used in the docker remove command
 *
 * @returns {Promise<string|Array>} - Response from the docker cli command
 */
const remove = args => {
  return removeCmd({ ...args, type: 'image' })
} 


module.exports = {
  remove,
}