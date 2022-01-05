const { apiError } = require('../utils/error/apiError')
const { noOpArr, noOpObj } = require('@keg-hub/jsutils')
const { Logger, runCmd } = require('@keg-hub/cli-utils')
const { isSafeExitCode } = require('../utils/exitCodes')
const { ensureDocker } = require('../utils/ensureDocker')

/**
 * Runs a raw docker cli command by spawning a child process
 * <br/> Auto adds docker to the front of the cmd if it does not exist
 * @function
 * @param {string} cmd - Docker command to be run
 * @param {string} args - Arguments to pass to the child process
 * @param {string} loc - Location where the cmd should be run
 *
 * @returns {*} - Response from the docker cli command
 */
 const raw = async (cmd, options=noOpObj, location) => {
  const { log, args=noOpArr, ...cmdOpts } = options

  // Build the command to be run
  // Add docker if needed
  const cmdToRun = ensureDocker(cmd)
  log && Logger.spacedMsg(`Running command: `, cmdToRun)

  // Run the docker command
  const exitCode = await runCmd(
    cmdToRun,
    args,
    { ...cmdOpts, cwd: cmdOpts.cwd || location }
  )

  // Get the exit code message
  const exitMessage = isSafeExitCode(exitCode)

  // Log the message or an error
  ;exitMessage
    ? log && Logger.success(exitMessage)
    : apiError(`Docker command exited with non-zero exit code: ${exitCode}`)
  
  return exitCode
}


module.exports = {
  raw
}