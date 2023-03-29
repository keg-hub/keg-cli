/** @module Task */

const { throwNoAction } = require('../error')
const { isFunc } = require('@keg-hub/jsutils')
const { hasHelpArg } = require('./hasHelpArg')
const { showHelp } = require('../logger/showHelp')
const { parseTaskArgs } = require('./parseTaskArgs')

/**
 * Executes the passed in task's action if it is a function.
 * <br/>Otherwise calls the `throwNoAction` error method
 * @function
 * @param {string} command - Name of the Keg CLI command to run
 * @param {Object} task - task object that's being executed
 * @param {Object} tasks - Global object containing all CLI tasks
 *
 * @returns {Any} - response from the task.action function
 */
const executeTask = async (args) => {
  const { globalConfig, task, options } = args

  // Check is the help should be printed
  if(hasHelpArg(options[ options.length -1 ])) return showHelp({ task, options })

  // Get the params for the task if they have not already been parsed
  const params = args.params || await parseTaskArgs(args, globalConfig)

  return isFunc(task.action)
    ? task.action({ ...args, params })
    : throwNoAction(task)

}

module.exports = {
  executeTask
}
