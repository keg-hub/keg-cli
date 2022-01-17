const { getContextEnv } = require('./getContextEnvs')
const {
  error,
  constants,
  getTapPath,
  getPathFromConfig,
  getKegGlobalConfig,
} = require('@keg-hub/cli-utils')

/**
 * Gets the location from the global config based on context and tap
 * @function
 * @param {Object} task - Current task being run
 * @param {Object} globalConfig - Global config object for the keg-cli
 * @param {string} context - Context to run the docker container in
 * @param {string} tap - Name of a linked tap in the globalConfig
 *
 * @returns {string} - The location where a command should be executed
 */
const getConfigLocation = async (context, globalConfig) => {
  return constants.INTERNAL_CONTAINERS.includes(context)
    // For the docker-compose commands, The context to be the keg-cli/containers folder
    ? `${ getPathFromConfig(globalConfig, 'containers') }/${ context }`
    // If it's a repoContext, then get the location for the repo from the context
    : context !== 'tap'
      ? await getContextEnv(context, `env.keg_context_path`, undefined, globalConfig)
      : getTapPath(tap, globalConfig)
}

/**
 * Gets the location where a docker command should be executed
 * @function
 * @param {Object} globalConfig - Global config object for the keg-cli
 * @param {Object} task - Current task being run
 * @param {string} context - Context to run the docker container in
 * @param {string} tap - Name of a linked tap in the globalConfig
 *
 * @returns {string} - The location where a command should be executed
 */
const getLocationContext = async (params, globalConfig=getKegGlobalConfig()) => {
  if(params.tapLocation) return params.tapLocation

  const context = params.tap || params.context
  const location = await getConfigLocation(context, globalConfig)

  // // Return the location, or throw because no location could be found
  return location || error.throwNoConfigPath(globalConfig, context)
}

module.exports = {
  getLocationContext
}