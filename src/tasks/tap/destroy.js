const { get } = require('@keg-hub/jsutils')
const { destroyService } = require('KegUtils/services')

/**
 * Removes all docker items for a tap based on the passed in service type
 * @param {Object} args - arguments passed from the runTask method
 * @param {string} args.command - Initial command being run
 * @param {Array} args.options - arguments passed from the command line
 * @param {Object} args.tasks - All registered tasks of the CLI
 * @param {Object} globalConfig - Global config object for the keg-cli
 *
 * @returns {void}
 */
const destroyTap = async (args) => {
  return destroyService(args, {
    context: 'tap',
    container: 'tap',
    tap: get(args, 'params.tap'),
    // TODO: fix this for injected apps
    ...(get(args, 'params.image') && { image: 'tap' }),
  })
}

module.exports = {
  destroy: {
    name: 'destroy',
    alias: [ 'dest', 'des', 'kill', 'down' ],
    inject: true,
    action: destroyTap,
    locationContext: 'CONTAINERS',
    description: `Destroys the docker items for a tap`,
    example: 'keg tap destroy <options>',
    /**
     * NOTE: If changing these options,
     * Also sure to update `destroyService#checkImgRemoveOpts` method to match changes
     * It uses the `args.options` array to check if the image should be removed
     */
    options: {
      tap: { 
        description: 'Name of the tap to destroy. Must be a tap linked in the global config',
        required: true,
      },
      image: {
        default: false,
        type: 'boolean',
        description: 'Remove the docker image related to the tap',
        example: 'keg tap destroy --image',
      },
      remove: {
        alias: [ 'rm' ],
        allowed: [ 'images', 'volumes', 'all', 'orphans' ],
        description: 'Remove collateral docker items while removing tap',
        example: 'keg tap down --remove images,volumes'
      },
    }
  }
}