const { remove } = require('../cmds/remove')
const { isStr } = require('@keg-hub/jsutils')
const { noItemError } = require('../utils/error/noItemError')

/**
 * Removes a docker image based on passed in toRemove argument
 * @function
 * @param {Object|string} [args={}] - Arguments used in the docker remove command || Name of container
 * @param {string} args.opts - Options used to build the docker command
 * @param {string} args.format - Format of the docker command output
 * @param {boolean} [shouldThrow=true] - Should an error be throw if the command fails
 *
 * @returns {string} - Response from the docker cli command
 */
const remove = async (args={}, shouldThrow=true) => {
  const opts = isStr(args)
    ? { item: args, type: 'container', skipError: !shouldThrow, shouldThrow }
    : args

  return opts.item
      ? await remove({ ...opts, type: 'container' })
      : noItemError(`docker.container.remove`, opts.shouldThrow || shouldThrow)
} 

module.exports = {
  remove
}
