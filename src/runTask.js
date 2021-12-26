/**
 * Sometimes this file is called directly with out using the keg-cli entry point
 * So we call require aliases here to ensure the alias still work
*/
require('../scripts/cli/aliases')

const Tasks = require('./tasks')
const { throwExitError } = require('KegUtils/error')
const { findTask, executeTask } = require('KegUtils/task')
const { hasHelpArg, showHelp } = require('@keg-hub/cli-utils')

/**
 * Runs a Keg CLI command
 *
 * @returns {Any} - Output of the executed task
 */
 const runTask = async (globalConfig) => {
  try {

    // Get the passed in arguments passed form the command line
    const [ command, ...args ] = process.argv.slice(2)

    // Load all possible tasks
    const cliTasks = Tasks(globalConfig)

    // If no command, or if the command is global help, then show help
    if(!command || hasHelpArg(command)) return showHelp({ tasks: cliTasks })

    // Get the taskData from available tasks
    const taskData = await findTask(globalConfig, cliTasks, command, args)

    // Run the task and get the response
    // Await the response to ensure the task completes before returning the response
    const response = await executeTask({
      ...taskData,
      command,
      globalConfig,
    })

    return response

  }
  catch(err){
    throwExitError(err)
  }
}

module.exports = {
  runTask,
}


