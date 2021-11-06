const { remove } = require('./remove')
const { isStr } = require('@keg-hub/jsutils')
const { containerCmds } = require('./containerCmd')

/**
 * Kills, then removes a docker container based on passed in arguments
 * @function
 * @param {Object|string} [args={}] - Arguments to kill and remove a container || container name
 * @param {string} args.opts - Options used to build the docker command
 * @param {string} args.format - Format of the docker command output
 *
 * @returns {boolean} - If the Docker command successfully ran
 */
const destroy = async (args={}) => {
  const opts = isStr(args) ? { item: args, type: 'container' } : args
  await containerCmds.kill({ ...opts, skipError: true, errResponse: false })

  return await remove({
    ...opts,
    skipError: true,
    errResponse: false
  })
}

module.exports = {
  destroy
}