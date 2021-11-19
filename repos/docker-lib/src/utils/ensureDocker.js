const { isStr } = require('@keg-hub/jsutils')

/**
 * Checks the start of the cmd string for the passed in check
 * If if does not exist it adds check to the start of the string
 * @param {string} cmd - command to be checked
 * @param {string} check - Word to check if exists at string of cmd
 * 
 * @returns {string} - cmd with check added if needed
 */
const checkStart = (cmd, check) => {
  return cmd.trim().indexOf(check) === 0 ? cmd : `${check} ${cmd}`
}

/**
 * Calls the docker cli from the command line and returns the response
 * @function
 * @param {string} cmd - docker command to be run
 *
 * @returns {string} - cmd with docker and action added if needed
 */
const ensureDocker = (cmd, action) => {
  cmd = cmd || ''
  const dockerCmd = isStr(action) ? checkStart(cmd, action) : cmd
  return checkStart(dockerCmd, 'docker').trim()
}

module.exports = {
  ensureDocker
}
