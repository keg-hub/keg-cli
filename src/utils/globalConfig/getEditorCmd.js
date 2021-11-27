const { get } = require('@keg-hub/jsutils')
const { constants } = require('@keg-hub/cli-utils')

/**
 * Gets the command to open an editor as configured in the global config
 * @param {Object} globalConfig - Global Keg-CLI config object
 */
const getEditorCmd = globalConfig => {
  return get(globalConfig, constants.GLOBAL_CONFIG_PATHS.EDITOR_CMD)
}

module.exports = {
  getEditorCmd
}