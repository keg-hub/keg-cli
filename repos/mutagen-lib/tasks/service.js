const { runInternalTask } = require('@keg-hub/cli-utils')

/**
 * Calls the mutagen create task internally
 * @param {Object} args - Default arguments passed to all tasks
 * @param {Object} argsExt - Arguments to override the passed in params
 * @param {Object} argsExt.composeRes - Response from the compose service
 *
 * @returns {*} - Response from the mutagen create task
 */
const mutagenService = async (args, argsExt) => {
  // Create the mutagen sync
  return runInternalTask('mutagen.tasks.create', {
    ...args,
    __internal: {
      ...args.__internal,
      skipThrow: true,
      skipError: true,
      skipExists: true,
    },
    params: {
      ...args.params,
      force: true,
      ...argsExt
    }
  })
}

module.exports = {
  mutagenService
}