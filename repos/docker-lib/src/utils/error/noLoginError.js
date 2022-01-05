const { Logger } = require('@keg-hub/cli-utils')
const { throwFailedCmd } = require('./throwFailedCmd')


/**
 * Throws an error when invalid arguments are passed to the docker login command
 * @function
 * @param {string} providerUrl - Url to log into
 * @param {string} user - User name to login with
 * @param {string} token - API token to access the providers API
 *
 * @returns {void}
 */
 const noLoginError = (providerUrl, user, token) => {
  const missing = !providerUrl ? 'providerUrl' : !user ? `user` : `token`

  Logger.empty()
  Logger.error(`  Docker login failed!`)
  Logger.info(`  Docker login requires a ${ missing } argument!`)
  Logger.empty()

  throwFailedCmd(`Docker login Failed!`)

}
