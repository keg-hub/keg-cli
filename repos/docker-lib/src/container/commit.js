const { raw } = require('../cmds/raw')

/**
 * Creates an image from the state of a currently running container
 * @function
 * @example
 * docker container commit keg-base
 * @param {Object} args - Arguments used to modify the docker api call
 * @param {string} args.container - Name of the container to commit
 * @param {string} args.item - Same as args.container
 * @param {string} args.author - The author of the new docker image
 * @param {string} args.message - Message for the commit
 *
 * @returns {Array} - JSON array of containers
 */
const commit = async (args, cmdOpts={}) => {

  const { container, item, author, message, location, tag } = args
  const cont = container || item

  // Add any passed options
  let options = []
  message && ( options = options.concat([ '--message', message ]) )
  author && ( options = options.concat([ '--author', author ]) )

  // Build the commit command
  const cmd = `commit ${ options.join(' ').trim() } ${ cont } ${ tag }`.trim()

  // Run the docker commit command
  return raw(cmd, cmdOpts, location)
}

module.exports = {
  commit
}