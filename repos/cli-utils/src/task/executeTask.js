const { throwNoAction } = require('../error')
const { isFunc } = require('@keg-hub/jsutils')
const { hasHelpArg } = require('./hasHelpArg')
const { showHelp } = require('../logger/showHelp')
const { parseTaskArgs } = require('./parseTaskArgs')

/**
 * Executes the passed in task.
 * <br/> Checks if a tasks has cmd key as a string, and if so runs it in a child process
 * <br/> Of if the cmd key as a function, it is called
 * <br/> The output of the the child process or function is passed to the task action
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
