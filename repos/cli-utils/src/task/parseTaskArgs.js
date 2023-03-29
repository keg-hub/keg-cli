/** @module Task */

const { argsParse } = require('@keg-hub/args-parse')
const { getGlobalOptions } = require('../globalConfig/globalOptions')
const { getKegGlobalConfig } = require('../globalConfig/getKegGlobalConfig')

/**
 * Wrapper around args parse to allow passing in the globalConfig
 * @function
 * @param {Object} args - Contains current task and options to be parsed
 * @param {Object} args.task - Current task being run
 * @param {Object} args.options - arguments passed from the cmd line
 * @param {Object} args.command - Name of the task being run
 * @param {Object} args.params - Extra params to pass on to the task
 * @param {Object} globalConfig - CLI global config object
 *
 * @returns {Object} - Object with parsed option arguments
 */
const parseTaskArgs = (args, globalConfig) => {
  const { command, task, params } = args
  
  globalConfig = globalConfig || getKegGlobalConfig()
  const globalOptions = getGlobalOptions(task, command)

  return argsParse(
    { args: args.options, task, params },
    { ...globalConfig.cli, defaultArgs: globalOptions  }
  )

}

module.exports = {
  parseTaskArgs,
}


