const { dockerCli } = require('../cmds/dockerCli')

/**
 * Gets all currently running containers in json format
 * @function
 * @param {Object} args - Options to pass to the docker container command
 * @param {string} args.opts - Options used to build the docker command
 * @param {string} args.format - Format of the docker command output
 *
 * @returns {Array} - Array of objects of running containers
 */
 const ps = async (args, cmdOpts) => {
  return await dockerCli({
    log: false,
    format: 'json',
    ...args,
    opts: [ 'ps' ]
  }, cmdOpts)
}

module.exports = {
  ps
}