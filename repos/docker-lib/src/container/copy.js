const { dockerCli } = require('../cmds/dockerCli')

/**
 * Copies files or folders to and from a docker container
 * @function
 * @param {Object} args - Options to pass to the docker container command
 * @param {string} args.container - Options used to build the docker command
 * @param {string} args.local - Local path for the copy command
 * @param {string} args.remote - Remote path on the container for the copy command
 * @param {boolean} [args.fromContainer=true] - Copy from remote to local
 *
 * @returns {Array} - Array of objects of running containers
 */
 const copy = ({ container, local, remote, fromContainer=true, ...args }, cmdOpts) => {
  const opts = fromContainer 
    ? [ 'cp', `${ container }:${ remote }`, local ]
    : [ 'cp', local, `${ container }:${ remote }` ]

  return dockerCli({ ...args, opts }, cmdOpts)
}


module.exports = {
  copy
}