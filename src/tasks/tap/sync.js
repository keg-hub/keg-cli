const { syncService } = require('KegUtils/services')

/**
 * Sync a local folder into the tap docker container
 * @param {Object} args - arguments passed from the runTask method
 * @param {string} args.command - Initial command being run
 * @param {Array} args.options - arguments passed from the command line
 * @param {Object} args.tasks - All registered tasks of the CLI
 * @param {Object} globalConfig - Global config object for the keg-cli
 *
 * @returns {void}
 */
const sync = async args => {
  return syncService(args, { container: 'tap' })
}

module.exports = {
  sync: {
    name: 'sync',
    alias: [ 'sy' ],
    inject: true,
    action: sync,
    locationContext: 'CONTAINERS',
    description: `Sync a local folder into the tap docker container`,
    example: '',
    options: {
      dependency: {
        alias: [ 'dep' ],
        description: 'Name of the dependency to sync into the tap container',
        enforced: true
      },
      tap: { 
        description: 'Name of the tap to run. Must be a tap linked in the global config',
        example: 'keg tap start --tap events-force',
        required: true,
      },
      local: {
        alias: [ 'from' ],
        description: 'Local path to sync into the tap container',
        enforced: true
      },
      remote: {
        alias: [ 'to' ],
        description: 'Path on the tap container to sync to',
        enforced: true
      },
      syncForce: {
        alias: [ 'force', 'sf' ],
        description: 'Force creating a sync even if a sync may already exists',
        default: false,
      }
    }
  }
}