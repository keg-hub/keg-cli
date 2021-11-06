const { dockerCli } = require('../cmds/dockerCli')
const { isArr, isStr } = require('@keg-hub/jsutils')

/**
 * Calls the docker api and gets a list of current images
 * @function
 * @param {Object} args - arguments used to modify the docker api call
 * @param {string} args.opts - Options used to build the docker command
 * @param {string} args.format - Format of the docker command output
 *
 * @returns {Array} - JSON array of all images
 */
const list = (args={}) => {
  const { opts } = args

  return dockerCli({
    format: 'json',
    ...args,
    opts: ['image', 'ls'].concat(
      isArr(opts)
        ? opts
        : isStr(opts)
          ? opts.split(' ')
          : []
    )
  })
}


module.exports = {
  list
}