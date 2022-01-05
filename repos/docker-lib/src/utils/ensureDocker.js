const { isStr, isArr } = require('@keg-hub/jsutils')

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
 * @param {string|Array<string>} action - Items that should be added before the docker keyword
 *
 * @returns {string} - cmd with docker and action added if needed
 */
const ensureDocker = (cmd, action) => {
  // Remove docker form the start of the string if it exists
  cmd = cmd ? cmd.replace(/^docker/, '').trim() : ''

  const dockerCmd = isStr(action)
    ? checkStart(cmd, action)
    : isArr(action)
      ? action.reduce((acc, act) => checkStart(acc, act), cmd)
      : cmd

  // Ensure docker gets added back to the command
  return checkStart(dockerCmd, 'docker').trim()
}

module.exports = {
  ensureDocker,
}
