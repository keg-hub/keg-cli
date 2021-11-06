const { getContainer } = require('./get')
const { dockerCli } = require('../cmds/dockerCli')
const { portToJson } = require('../utils/output/portToJson')

/**
 * Gets the bound ports for a container
 * @function
 * @param {Object} args - Options to find the container and it's port
 * @param {Object} cmdOpts - Options to send to the spawned child process
 *
 * @returns {string|Array} - Response from docker cli
 */
 const port = async (args, cmdOpts) => {
  const { item, port, format='json' } = args

  const container = await getContainer(item)
  if(!container) return false

  const opts = [ 'port', item ]
  port && opts.push(port)

  const portData = await dockerCli({ opts }, cmdOpts)
  
  return format === 'json'
    ? portToJson(portData, port)
    : portData
}

module.exports = {
  port
}