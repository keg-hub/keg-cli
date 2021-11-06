
/**
 * Calls the docker cli from the command line and returns the response
 * @function
 * @param {string} cmd - docker command to be run
 *
 * @returns {string} - cmd with docker added
 */
const ensureDocker = cmd => cmd.trim().indexOf('docker') === 0 ? cmd : `docker ${cmd}`

module.exports = {
  ensureDocker
}
