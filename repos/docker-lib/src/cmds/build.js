const { noOpArr, noOpObj } = require('@keg-hub/jsutils')
const { apiError } = require('../utils/error/apiError')
const { Logger, runCmd } = require('@keg-hub/cli-utils')
const { ensureDocker } = require('../utils/ensureDocker')

/**
 * Builds a Docker command to be run in a child process
 * @param {string} cmd - The docker build command to run including the `build`
 * @param {Object} options - Options for building the docker image
 */
const build = async (cmd, options=noOpObj, location) => {
  const { log=true, context, args=noOpArr, ...cmdOpts } = options

  // Build the command to be run
  const cmdToRun = ensureDocker(cmd, 'build')
  log && Logger.spacedMsg(`Running command: `, cmdToRun)

  // Run the docker command
  const exitCode = await runCmd(
    cmdToRun,
    args,
    { ...cmdOpts, cwd: cmdOpts.cwd || location }
  )

  ;exitCode
    ? apiError(`${context || 'Docker'} image failed to build!`.trim())
    : log && Logger.pair(`Finished building image`, `${context || ''}`.trim())

  Logger.empty()

  return exitCode
}

module.exports = {
  build
}