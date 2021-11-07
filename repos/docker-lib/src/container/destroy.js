const { remove } = require('./remove')
const { containerCmds } = require('./containerCmd')
const { formatParams } = require('../utils/formatParams')

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
  const opts = formatParams(
    'item',
    args,
    ['opts', 'format', 'type', 'skipError', 'errResponse'],
    { type: 'container', skipError: true, errResponse: false }
  )
  
  await containerCmds.kill(opts)

  return await remove(opts)
}

module.exports = {
  destroy
}