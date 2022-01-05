const { raw } = require('../cmds/raw')
const { pickKeys, noOpObj } = require('@keg-hub/jsutils')

/**
 * Creates an image from the state of a currently running container
 * @function
 * @example
 * docker container commit keg-base
 * @param {Object} args - Arguments used to modify the docker api call
 * @param {string} args.container - Name or Id of the container to commit
 * @param {string} args.author - The author of the new docker image
 * @param {string} args.message - Message for the commit
 * @param {string} args.tag - Tag to use when creating the image
 *
 * @returns {Array} - JSON array of containers
 */
const commit = async (args=noOpObj, cmdOpts={}) => {

  const {
    tag,
    author,
    message,
    location,
    container
  } = pickKeys(args, [
    'tag',
    'author',
    'message',
    'location',
    'container'
  ])

  // Add any passed options
  let options = []
  message && options.push('--message', message)
  author && options.push('--author', author)

  // Build the commit command
  const cmd = `commit ${ options.join(' ').trim() } ${ container } ${ tag }`.trim()

  // Run the docker commit command
  return raw(cmd, cmdOpts, location)
}

module.exports = {
  commit
}