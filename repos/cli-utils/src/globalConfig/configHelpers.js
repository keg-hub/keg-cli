const { get } = require('@keg-hub/jsutils')
const { GLOBAL_CONFIG_PATHS } = require('../constants')
const { getKegGlobalConfig } = require('./getKegGlobalConfig')

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
 * @param {Object} globalConfig - Global Keg-CLI config object
 */
const getEditorCmd = globalConfig => {
  return get(globalConfig || getKegGlobalConfig(), GLOBAL_CONFIG_PATHS.EDITOR_CMD)
}

/**
 * Gets a setting from the global config
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
}