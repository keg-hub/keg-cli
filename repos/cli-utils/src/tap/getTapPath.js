const { get, validate, isObj, isStr } = require('@keg-hub/jsutils')
const { GLOBAL_CONFIG_PATHS } = require('../constants/constants')
const { getKegGlobalConfig } = require('../globalConfig/getKegGlobalConfig')

/**
 * Switch the first and second args if the first arg is an object
 * Makes the method backwards compatible
 * @example
 * // Either below call pattern works
 * getTapPath(globaConfig, tapName) || getTapPath(tapName, globaConfig)
 */
const resolveArgs = args => (isObj(args[0]) ? [args[1], args[0]] : args)

/**
 * Gets a path from the stored paths in the globalConfig object
 * @param {string} tapName - Key name of the linked tap path to get
 * @param {Object} globalConfig - Global config object for the Keg CLI
 *
 * @returns {string} - Found path
 */
const getTapPath = (...args) => {
  const [tapName, globalConfig=getKegGlobalConfig()] = resolveArgs(args)

  validate(
    { globalConfig, tapName }, 
    { globalConfig: isObj, tapName: isStr }, 
    { throws: true }
  )

  return get(globalConfig, `${GLOBAL_CONFIG_PATHS.TAP_LINKS}.${tapName}.path`)
}

module.exports = {
  getTapPath
}