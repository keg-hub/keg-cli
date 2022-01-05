const { list } = require('./list')
const { containerCmd } = require('./containerCmd')
const { pickKeys, noOpArr, noOpObj } = require('@keg-hub/jsutils')

/**
 * Removes all stopped containers
 * @function
 * @param {Object} args - Arguments used to modify the docker api call
 * @param {Array} args.opts - Options used to build the docker command
 * @param {string} args.format - Format of the docker command output, i.e. json
 *
 * @returns {*} - Response from the docker cli command
 */
const clean = async (_args=noOpObj) => {
  const { opts=noOpArr, ...args } = pickKeys(_args, [
    'log',
    'opts',
    'format',
    'skipError'
  ])

  // Get all built containers
  const containers = await list()

  // Get all stopped containers
  const stopped = containers.reduce((ids, container) => {
    container.status.indexOf('Exited') === 0 &&
      ids.push(container.id)

    return ids
  }, [])

  // If there are any stopped, then removed them
  return stopped.length && 
    containerCmd({
      ...args,
      opts: [
        'rm',
        ...opts,
        ...stopped
      ],
    })

}


module.exports = {
  clean
}