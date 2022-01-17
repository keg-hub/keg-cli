const { get, isStr } = require('@keg-hub/jsutils')
const { loadEnvs } = require('../envs/loadEnvs')
const { paramsToEnvs } = require('../envs/paramsToEnvs')
const {
  cliStore,
  getDefaultEnv,
  resolveBestPath,
  getKegGlobalConfig
} = require('@keg-hub/cli-utils')


/**
 * Ensures the passed in params is an object
 * @param {Object|string} params - Params object or the context to get the context ENVs for
 * @function
 *
 * @returns {Object} - Params as an object, with the default env added when params is a string
 */
const getParamsObj = params => {
  return isStr(params)
    ? {context: params, env: getDefaultEnv()}
    : params
}

/**
 * Loads a single env value from the context envs
 * If the envs don't exist, it tries to load them
 * @function
 * @param {Object|string} params - Params object or the context to get the context ENVs for
 * @param {string} params.context - context to get the context ENVs for
 * @param {string} param.env - Current env the process is running it
 * @param {string} envName - Name of the env to get the value of
 * @param {*} altVal - Value to use if the env value can not be found
 * @param {Object} globalConfig - Global config object for the keg-cli
 *
 * @returns {*} - Value of the env if it's found
 */
const getContextEnv = (params, envName, altVal, globalConfig) => {
  const paramObj = getParamsObj(params)
  const {context} = paramObj
  const contextEnvs = cliStore.context.get(`${context}-envs`) ||
    getContextEnvs(paramObj, globalConfig)

  return get(contextEnvs, envName.toUpperCase(), altVal)
}

/**
 * Loads the context envs based on teh passed in params
 * @function
 * @param {Object} params - Parameters passed to the task from the cmd line
 * @param {string} params.context - context to get the context ENVs for
 * @param {string} params.tap - Name of the tap to get the context ENVs for
 * @param {string} params.env - Current env the process is running it
 * @param {Object} globalConfig - Global config object for the keg-cli
 *
 * @returns {Object} - Flat object containing the ENVs for the cmdContext
 */
const getContextEnvs = (params, globalConfig=getKegGlobalConfig()) => {
  const paramObj = getParamsObj(params)
  const {context, env} = paramObj

  // Check if the context envs already exist in the store
  const existingEnvs = cliStore.context.get(`${context}-envs`) 
  if(existingEnvs) return existingEnvs

  // Try to find the best path to use for loading envs
  // based in the passed in params
  const location = resolveBestPath(paramObj, globalConfig)

  const envs = loadEnvs({
    env,
    name: context,
    locations: [location],
  })

  const paramEnvs = paramsToEnvs(
    paramObj,
    envs.KEG_COPY_LOCAL
  )

  const contextEnvs = {
    COMPOSE_PROJECT_NAME: context,
    // Set the KEG_CONTEXT_PATH to ensure it gets set
    // But set it before the others so it can be overwritten 
    KEG_CONTEXT_PATH: location,
    ...envs,
    ...paramEnvs,
  }

  // Update the store with the cached envs, so next call can use the cached version
  cliStore.context.set(`${context}-envs`, contextEnvs, {merge: true})

  return contextEnvs
}

module.exports = {
  getContextEnv,
  getContextEnvs,
}