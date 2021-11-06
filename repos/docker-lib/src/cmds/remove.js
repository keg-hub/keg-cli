const { dockerCli } = require('./dockerCli')
const { noItemError } = require('../utils/error/noItemError')

/**
 * Calls the docker remove command to remove a docker item
 * @function
 * @param {string} toRemove - Name or id of item to remove
 * @param {boolean} force - Should force remove the item
 *
 * @returns {Promise<string|Array>|Error}
 */
 const remove = ({ item, force, skipError, type='' }, cmdOpts) => {
  return item
    ? dockerCli({
        force,
        skipError: skipError,
        opts: `${ type } rm ${ item }`.trim(),
      }, cmdOpts)
    : noItemError(`docker.remove`)
}

module.exports = {
  remove
}
