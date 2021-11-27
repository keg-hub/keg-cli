const { noOpObj } = require('@keg-hub/jsutils')
const { inspect:inspectCmd } = require('../cmds/inspect')

/**
 * Runs docker image inspect for the passed in image
 * @function
 * @param {Object} args - Arguments to pass to the docker image command
 * @param {string} args.image - Reference to the docker image
 * @param {string} args.item - Alt reference to the docker image
 * @param {boolean} args.parse - Should parse the response into JSON
 * @param {string} [args.format=json] - Format the returned results
 *
 * @returns {string|Object} - Docker image information
 */
 const inspect = async (_args=noOpObj) => {
  const { image, item, ...args } = _args

  return await inspectCmd({
    format: 'json',
    ...args,
    type: 'image',
    item: image || item,
  })
}

module.exports = {
  inspect,
}