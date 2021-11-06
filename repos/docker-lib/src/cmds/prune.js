const { dockerCli } = require('./dockerCli')
const { isArr } = require('@keg-hub/jsutils')

/**
 * Runs docker system prune command
 * @function
 * @param {Array|string} options - Options for the prune command
 *
 * @returns {*} - Response from the docker cli command
 */
 const prune = opts => {
  return dockerCli({
    log: true,
    opts: [ 'system', 'prune'].concat(isArr(opts) ? opts : [ opts ]),
  })
}

module.exports = {
  prune
}