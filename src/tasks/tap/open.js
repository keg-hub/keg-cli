const { runInternalTask } = require('KegUtils/task/runInternalTask')


/**
 * Opens tap folder path into the editor set in the globalConfig
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
    params: { name: params.tap },
    options: [ params.tap, ...args.options ],
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