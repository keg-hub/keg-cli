const { get, mapObj } = require('@keg-hub/jsutils')
const { throwTaskFailed } = require('./throwTaskFailed')
const { constants, Logger } = require('@keg-hub/cli-utils')

const { GLOBAL_CONFIG_PATHS } = constants
/*
 * Helper to log an error message when a path can not be found in the global config
 * @function
 * @param {Object} globalConfig - Global config object for the keg-cli
 * @param {string} pathName - Name of the path that can not be found
 *
 * @returns {void}
*/
const throwNoConfigPath = (globalConfig, pathName) => {

  Logger.empty()

  Logger.error(`Global config path '${pathName}' does not exist in the paths config!`)

  Logger.empty()
  Logger.empty()

  Logger.success(`Global Config:`)
  Logger.empty()

  Logger.cyan(`Repo Paths:`)
  Logger.data(get(globalConfig, `${ GLOBAL_CONFIG_PATHS.CLI_PATHS }`))

  Logger.empty()

  const linkPaths = {}
  mapObj(get(globalConfig, `${ GLOBAL_CONFIG_PATHS.TAP_LINKS }`, {}), (alias, tapConfig) => {
    linkPaths[alias] = tapConfig.path
  })

  Logger.cyan(`Linked Taps:`)
  Logger.data(linkPaths)

  Logger.empty()

  throwTaskFailed()

}

module.exports = {
  throwNoConfigPath
}