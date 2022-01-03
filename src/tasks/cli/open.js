const { runInternalTask } = require('@keg-hub/cli-utils')


/**
 * Opens keg-cli folder path into the editor set in the globalConfig
 * @function
 * @param {Object} args - arguments passed from the runTask method
 * @param {Object} args.globalConfig - Global config object for the keg-cli
 *
 * @returns {void}
 */
const tapOpen = args => {
  const { params } = args

  return runInternalTask('tasks.open', {
    ...args,
    command: 'open',
    params: { name: 'cli' },
    options: [ 'cli', ...args.options ],
  })

}

module.exports = {
  open: {
    name: 'open',
    action: tapOpen,
    description: `Opens a tap in the settings defined editor`,
    example: 'keg tap open'
  }
}