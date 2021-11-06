const { apiError } = require('../utils/error/apiError')
\const { Logger, execCmd } = require('@keg-hub/cli-utils')
const { noLoginError } = require('../utils/error/noLoginError')

/**
 * Calls the docker login command to log into the passed int providerUrl
 * @function
 * @param {Object} creds - Credentials to log into a docker registry provider
 * @param {string} creds.providerUrl - The url used to log into the provider
 * @param {string} creds.user - User used to login to the provider
 * @param {string} creds.token - Auth token for the docker registry provider
 *
 * @returns {void}
 */
 const login = async ({ providerUrl, user, token }) => {

  if(!providerUrl || !user || !token) noLoginError(providerUrl, user, token)

  // Use the --password-stdin to the token is not stored in the bash history
  const loginCmd = `echo ${ token } | docker login ${ providerUrl } --username ${user} --password-stdin`

  Logger.empty()
  Logger.info(`  Logging into docker provider "${ providerUrl }", with user "${ user }"`)
  Logger.empty()

  const { error, data } = await execCmd(loginCmd)

  return error && !data
    ? apiError(error)
    : Logger.success(`  Docker ${ data }`)

}

module.exports = {
  login
}
