#!/usr/bin/env node

/** @module CLI */

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
 * Executes tasks based on passed in **Task Definitions**
 * <br/>Pulls arguments from `process.argv` and uses them to find a matching task
 * <br/>Parses the remaining arguments into parameter as defined by the matching tasks defined options
 * <br/>If the `help` argument if found will call the `showHelp` method instead of the `task.action` method
 * <br/>Also tries to load the global `Keg-CLI` GlobalConfig, and passes it to the `task.action` when found
 * @function
 * @param {Object} customTasks - Custom tasks to add to the task cache
 * @param {Object} customDefParams - Default params added to all tasks
 * @example
 * await runTask(
 *  { task1: { name: 'task1', action: someFunction, description: 'Calls someFunction' } },
 *  { param1: 'some-value', param2: 'other-value'}
 * )
 * @returns {Any} - Response of the executed task
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

module.exports = { runTask }
