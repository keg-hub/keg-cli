/** @module Global-Config */

const { get } = require('@keg-hub/jsutils')
const { getKegGlobalConfig } = require('./getKegGlobalConfig')
const { GLOBAL_CONFIG_FOLDER, GLOBAL_CONFIG_PATHS } = require('../constants')

/**
 * Gets the default env setting from the keg global config
 * @function
 *
 * @returns {string} - Default env from the global config 
 */
const getDefaultEnv = () => {
  return process.env.KEG_DEFAULT_ENV || getKegSetting('defaultEnv')
}

/**
 * Gets the command to open an editor as configured in the global config
 * @function
 * @param {Object} globalConfig - Global Keg-CLI config object
 */
const getEditorCmd = globalConfig => {
  return get(globalConfig || getKegGlobalConfig(), GLOBAL_CONFIG_PATHS.EDITOR_CMD)
}

/**
 * Gets a path from the stored paths in the globalConfig object
 * @function
 * @param {Object} globalConfig - Global config object for the Keg CLI
 * @param {string} pathName - Key name of the path to get
 *
 * @returns {string} - Found path
 */
const getPathFromConfig = (globalConfig, pathName) => {
  return pathName === 'config'
    // If getting the global config path, just use the constants
    ? GLOBAL_CONFIG_FOLDER
    // Load the global config and get the path from the config
    : get(globalConfig || getKegGlobalConfig(), `${ GLOBAL_CONFIG_PATHS.CLI_PATHS }.${pathName}`)
}

/**
 * Gets a setting from the global config
 * @function
 * @param {Object} setting - Name of the setting to get
 *
 * @returns {string|number|Object|Array} - Found setting
 */
const getKegSetting = (setting, globalConfig) => {
  return get(globalConfig || getKegGlobalConfig(), `cli.settings.${ setting }`)
}


module.exports = {
  getEditorCmd,
  getKegSetting,
  getDefaultEnv,
  getPathFromConfig,
}