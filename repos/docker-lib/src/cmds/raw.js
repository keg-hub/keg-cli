const { Logger } = require('@keg-hub/cli-utils')
const { apiError } = require('../utils/error/apiError')
const { isSafeExitCode } = require('../utils/exitCodes')
const { ensureDocker } = require('../utils/ensureDocker')
const { spawnProc } = require('../process')

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
 const raw = async (cmd, args={}, loc=process.cwd()) => {
  const { log, ...cmdArgs } = args

  // Build the command to be run
  // Add docker if needed
  const cmdToRun = ensureDocker(cmd)
  log && Logger.spacedMsg(`Running command: `, cmdToRun)

  // Run the docker command
  const exitCode = await spawnProc(cmdToRun, cmdArgs, loc)

  // Get the exit code message
  const exitMessage = isSafeExitCode(exitCode)

  // Log the message or an error
  ;exitMessage
    ? Logger.success(exitMessage)
    : apiError(`Docker command exited with non-zero exit code!`)
  
  return exitCode
}


module.exports = {
  raw
}