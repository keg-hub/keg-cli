const { runInternalTask } = require('@keg-hub/cli-utils')
const { mergeTaskOptions } = require('KegUtils/task/options/mergeTaskOptions')

/**
 * Builds a keg base docker image
 * @param {Object} args - arguments passed from the runTask method
 * @param {string} args.command - Initial command being run
 * @param {Array} args.options - arguments passed from the command line
 * @param {Object} args.tasks - All registered tasks of the CLI
 * @param {Object} globalConfig - Global config object for the keg-cli
 *
 * @returns {void}
 */
const buildBase = async (args) => {
  return await runInternalTask(`tasks.docker.tasks.build`, {
    ...args,
    __internal: {
      ...args.__internal,
      locationContext: args.task.locationContext,
    },
    params: { ...args.params, context: 'base', tap: undefined },
  })
}

module.exports = {
  build: {
    name: 'build',
    alias: [ 'bld', 'make' ],
    inject: true,
    action: buildBase,
    locationContext: 'REPO',
    description: `Builds a taps docker container`,
    example: 'keg base build <options>',
    options: mergeTaskOptions(`base`, `build`, `build`, {}, [])
  }
}