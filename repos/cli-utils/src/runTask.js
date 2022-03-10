#!/usr/bin/env node

const { throwExitError } = require('./error')
const { findTask } = require('./task/findTask')
const { showHelp } = require('./logger/showHelp')
const { deepMerge } = require('@keg-hub/jsutils')
const { getTaskDefinitions } = require('./tasks')
const { hasHelpArg } = require('./task/hasHelpArg')
const { argsParse } = require('@keg-hub/args-parse')
const { getKegGlobalConfig } = require('./globalConfig/getKegGlobalConfig')

const defParams = { env: process.env.NODE_ENV || 'local' }

/**
 * Runs a local task matching the Keg-CLI task definition
 * This allows the tasks to be injected into the Keg-CLI when installed
 * @param {Object} customTasks - Custom tasks to add to the task cache
 * @param {Object} customDefParams - Default params added to all tasks
 *
 * @returns {Any} - Output of the executed task
 */
const runTask = async (customTasks, customDefParams, parseConfig) => {
  const globalConfig = getKegGlobalConfig(false)

  try {
    const args = process.argv.slice(2)
    const Definitions = await getTaskDefinitions(customTasks)

    // If no first arg, or if the first arg is global help, then show help
    if(!args[0] || hasHelpArg(args[0])) return showHelp({ tasks: Definitions })

    const { task, options } = findTask(Definitions, [...args])

    // If the last options in a help arg, show help
    if(hasHelpArg(options[options.length - 1]))
      return showHelp({ task, options })

    // Parse the args with the same package as the Keg-CLI, to ensure its consistent
    const params = await argsParse({
      task,
      args: [...options],
      params: deepMerge(defParams, customDefParams)
    }, parseConfig)

    // Call the task action, and pass in args matching the same as the Keg-CLI args
    const response = await task.action({
      task,
      params,
      options,
      globalConfig,
      command: args[0],
      tasks: Definitions,
    })

    return response
  }
  catch (err) {
    throwExitError(err)
  }
}

// Check if the parent module ( task module ) has a parent
// If it does, then it was called by the Keg-CLI
// So we should return the task definition instead of running the task action
module.parent
  ? (module.exports = { runTask })
  : runTask()
