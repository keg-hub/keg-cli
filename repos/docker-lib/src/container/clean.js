const { list } = require('./list')
const { containerCmd } = require('./containerCmd')

/**
 * Removes all stopped containers
 * @function
 * @param {Object} args - Arguments used to modify the docker api call
 * @param {string} args.opts - Options used to build the docker command
 * @param {string} args.format - Format of the docker command output
 *
 * @returns {*} - Response from the docker cli command
 */
const clean = async args => {

  // Get all built containers
  const containers = await list()

  // Get all stopped containers
  const stopped = containers.reduce((ids, container) => {
    return container.status.indexOf('Exited') === 0
      ? ids.concat(container.id)
      : ids
  }, [])

  // If there are any stopped, then removed them
  return stopped.length && 
    containerCmd(
      { ...args, format: undefined },
      [ 'rm' ].concat(stopped)
    )

}


module.exports = {
  clean
}