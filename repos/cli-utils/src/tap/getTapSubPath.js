const { GLOBAL_CONFIG_PATHS } = require('../constants/constants')
const { get, validate, isObj, isStr } = require('@keg-hub/jsutils')
const { getKegGlobalConfig } = require('../globalConfig/getKegGlobalConfig')

/**
 * Gets a sub path for a linked tap when it exists
 * Useful for taps that act as mono-repos
 * @param {string} tapName - Key name of the linked tap path to get
 * @param {string} subName - Key name of the sub path to get
 * @param {Object} globalConfig - Global config object for the Keg CLI
 *
 * @returns {string} - Found path
 */
const getTapSubPath = (tapName, subName, globalConfig=getKegGlobalConfig()) => {
  validate(
    { globalConfig, tapName }, 
    { globalConfig: isObj, tapName: isStr }, 
    { throws: true }
  )

  // TODO: Add loading a taps tap.js file and check it for sub paths
  // Migrate towards tap.js config holding more config options
  // Move it out of the Keg-CLI global config
  return get(globalConfig, `${GLOBAL_CONFIG_PATHS.TAP_LINKS}.${tapName}.paths.${subName}`)
  
}

module.exports = {
  getTapSubPath
}