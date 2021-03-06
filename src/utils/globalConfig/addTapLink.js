const { get, set, isObj } = require('@keg-hub/jsutils')
const { constants, Logger } = require('@keg-hub/cli-utils')
const { addGlobalConfigProp } = require('./addGlobalConfigProp')

const { GLOBAL_CONFIG_PATHS } = constants

/**
 * Adds the tap link to the global config object and saves it
 * @param {Object} globalConfig - Global config object for the keg-cli
 * @param {string} name - Name of the tap to link
 * @param {Object} tapObj - Config object for the linked tap
 * @param {string} tapObj.path - Path to the linked tap repo
 * @param {string} tapObj.tasks - Path to the custom tasks file 
 * @param {boolean} silent - Skipping logging anything to terminal
 *
 * @returns {void}
 */
const addTapLink = (globalConfig, name, tapObj, silent) => {

  // Ensure the path to save tap links exists
  !isObj(get(globalConfig, GLOBAL_CONFIG_PATHS.TAP_LINKS)) &&
    set(globalConfig, GLOBAL_CONFIG_PATHS.TAP_LINKS, {})

  // Save the link to the global config
  addGlobalConfigProp(
    globalConfig,
      // Build the path in the globalConfig where the link will be saved
    `${GLOBAL_CONFIG_PATHS.TAP_LINKS}.${name}`,
    tapObj
  )

  if(silent) return

  Logger.success(`Successfully linked tap '${name}' => '${tapObj.path}'`)
  Logger.empty()
}

module.exports = {
  addTapLink
}