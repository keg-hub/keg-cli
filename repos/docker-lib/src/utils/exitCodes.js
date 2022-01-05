
/**
 * Docker container exit codes and relative messages
 * See here for more https://stackoverflow.com/questions/31297616/what-is-the-authoritative-list-of-docker-run-exit-codes
 * @object
 */
 const safeExitCodes = {
  '0': `Finished running Docker command!`,
  '130': `Container session terminated by user!`,
  '137': `Container session received a SIGKILL`,
  '143': `Container session received a SIGTERM`,
}

/**
 * Checks if a docker container exited safely
 * @function
 * @param {number|string} exitCode - Exit code for the docker container
 *
 * @returns {boolean|string} - False is not safe exit, string message is was a safe exit
 */
const isSafeExitCode = exitCode => {
  return safeExitCodes[exitCode] || false
}

module.exports = {
  safeExitCodes,
  isSafeExitCode
}