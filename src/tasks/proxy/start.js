const { composeService } = require('KegUtils/services')
const { mergeTaskOptions } = require('KegUtils/task/options/mergeTaskOptions')

/**
 * Start keg-proxy with docker-compose
 * @param {Object} args - arguments passed from the runTask method
 * @param {string} args.command - Initial command being run
 * @param {Array} args.options - arguments passed from the command line
 * @param {Object} args.tasks - All registered tasks of the CLI
 * @param {Object} globalConfig - Global config object for the keg-cli
 *
 * @returns {void}
 */
const startProxy = async (args) => {
  return composeService({
    ...args,
    __internal: {
      ...args.__internal,
      skipDockerExec: true,
      skipDockerSyncs: true,
      locationContext: args.task.locationContext,
    },
  },
  {
    context: 'proxy',
    pull: false,
    follow: false,
    service: 'proxy',
    container: 'keg-proxy',
  })

}
module.exports = {
  start: {
    name: 'start',
    alias: [ 'st' ],
    action: startProxy,
    inject: true,
    locationContext: 'CONTAINERS',
    description: `Runs keg-proxy in a docker container`,
    example: 'keg proxy start <options>',
    options: mergeTaskOptions('proxy', 'start', 'startService')
  }
}
