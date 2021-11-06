const { spawnProc } = require('../process')
const { Logger } = require('@keg-hub/cli-utils')
const { apiError } = require('../utils/error/apiError')
const { ensureDocker } = require('../utils/ensureDocker')

/**
 * Builds a Docker command to be run in a child process
 */
const build = async (cmd, args={}, loc=process.cwd()) => {
  const { log=true, context, ...cmdArgs } = args

  // Build the command to be run
  const cmdToRun = ensureDocker(cmd)
  log && Logger.spacedMsg(`Running command: `, cmdToRun)

  // Run the docker command
  const exitCode = await spawnProc(cmdToRun, cmdArgs, log)

  ;exitCode
    ? apiError(`${context || ''} image failed to build!`.trim())
    : Logger.pair(`Finished building image`, `${context || ''}`.trim())

  Logger.empty()

  return exitCode
}

module.exports = {
  build
}