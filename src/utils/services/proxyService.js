const docker = require('@keg-hub/docker-lib')
const { runInternalTask } = require('@keg-hub/cli-utils')
const { checkEnvConstantValue } = require('KegUtils/helpers/checkEnvConstantValue')

/**
 * Checks if the proxy container exists, and if not, starts it
 * @function
 * @param {Object} args - Default task arguments passed from the runTask method
 *
 * @returns {boolean} - True if the proxy container already exists
 */
const proxyService = async args => {
  const { params } = args
  const { tap, context } = params

  // Check if the container need the keg-proxy started
  // If KEG_USE_PROXY is set to false then don't start the proxy
  // If it's true or not defined, then start the proxy
  const startProxy = !checkEnvConstantValue(tap || context, 'KEG_USE_PROXY', false)
  if(startProxy === false) return false

  // Make call to check if the keg-proxy container exists
  const proxyContainer = await docker.container.get(
    `keg-proxy`,
    container => container.name === `keg-proxy`,
    'json'
  )

  const proxyNotRunning = Boolean(!proxyContainer || proxyContainer.state !== 'running')

  // If the proxy container does not exist or it's not running, then start it
  // This will ensure we can route traffic to all other containers
  proxyNotRunning &&
    await runInternalTask(`proxy.tasks.start`, {
      ...args,
      params: {},
    })

  return true
}

module.exports = {
  proxyService
}