const path = require('path')
const appRoot = require('app-root-path').path
const defConfig = require('../../configs/parse.config.js')
const { deepMerge, get, noOpObj, toBool, noPropArr, flatUnion } = require('@keg-hub/jsutils')

/**
 * Placeholder variable to cache the loaded config
 * @Object
 */
let __CONFIG

/**
 * Builds the environment object for the parse config
 * Values with higher priority override lower priority
 * @function
 * @param {Object} - Custom environment from the custom config
 * @param {Object} - inline environment from the inline config
 *
 * @returns {Object} - Built environment config object
 */
const buildEnvironment = (customEnv=noOpObj, inlineEnv=noOpObj) => {
  return {
    ...defConfig?.environment,
    ...customEnv,
    ...inlineEnv,
    options: flatUnion([
      ...defConfig.environment?.options,
      ...(inlineEnv?.options || noPropArr),
      ...(customEnv?.options || noPropArr)
    ]),
    map: {
      ...defConfig?.environment?.map,
      ...(inlineEnv?.map || noOpObj),
      ...(customEnv?.map || noOpObj),
    }
  }
}

/**
 * Builds the default args object for the parse config
 * Values with higher priority override lower priority
 * @function
 * @param {Object} - Custom defaultArgs from the custom config
 * @param {Object} - inline defaultArgs from the inline config
 *
 * @returns {Object} - Built defaultArgs config object
 */
const buildDefArgs = (customArgs=noOpObj, inlineArgs=noOpObj) => {
  const { env, ...defArgs } = defConfig?.defaultArgs

  return {
    ...deepMerge(defArgs, customArgs, inlineArgs ),
    env: inlineArgs?.env || customArgs?.env || defConfig?.defaultArgs?.env
  }
}

/**
 * Builds the default bools object for the parse config
 * Values with higher priority override lower priority
 * @function
 * @param {Object} - Custom bools from the custom config
 * @param {Object} - inline bools from the inline config
 *
 * @returns {Object} - Built bools config object
 */
const buildBools = (customBools=noOpObj, inlineBools=noOpObj) => {
  return {
    truthy: flatUnion([
    ...defConfig?.bools?.truthy,
    ...(customBools?.truthy || noPropArr),
    ...(inlineBools?.truthy || noPropArr)
    ]),
    falsy: flatUnion([
      ...defConfig?.bools?.falsy,
      ...(customBools?.falsy || noPropArr),
      ...(inlineBools?.falsy || noPropArr)
    ])
  }
}

/**
 * Loads the config object based on PARSE_CONFIG_PATH env or the default
 * @function
 * @param {Object} - inline config passed from the caller of args-parse
 *
 * @returns {Object} - Loaded config object
 */
const loadConfig = (inlineConfig=noOpObj) => {
  const { PARSE_CONFIG_PATH, KEG_TASKS_CONFIG, TASKS_CONFIG_PATH } = process.env
  const envConfig = PARSE_CONFIG_PATH || TASKS_CONFIG_PATH || KEG_TASKS_CONFIG
  
  const configPath = path.join(
    appRoot,
    PARSE_CONFIG_PATH || TASKS_CONFIG_PATH || KEG_TASKS_CONFIG || 'configs/parse.config.js'
  )

  let customConfig
  try { customConfig = require(configPath)  }
  catch(err){
    toBool(envConfig) && console.error(err.stack)
    customConfig = noOpObj
  }

  return {
    ...defConfig,
    ...inlineConfig,
    ...(customConfig || noOpObj),
    settings: deepMerge(
      defConfig?.settings,
      get(customConfig, 'settings'),
      get(inlineConfig, 'settings')
    ),
    bools: buildBools(
      get(customConfig, 'bools'),
      get(inlineConfig, 'bools')
    ),
    environment: buildEnvironment(
      get(customConfig, 'environment'),
      get(inlineConfig, 'environment')
    ),
    defaultArgs: buildDefArgs(
      get(customConfig, 'defaultArgs'),
      get(inlineConfig, 'defaultArgs')
    )
  }
}

/**
 * Returns the cached config of calls loadConfig to load it
 * @function
 *
 * @returns {Object} - Loaded config object
 */
const getConfig = inlineConfig => {
  __CONFIG = __CONFIG || loadConfig(inlineConfig)

  return __CONFIG
}

/**
 * Clears the config for testing config loading
 * @function
 *
 * @returns {void}
 */
const clearConfig = () => __CONFIG = undefined

module.exports = {
  getConfig,
  ...(process.env.NODE_ENV === 'test' && { clearConfig })
}
