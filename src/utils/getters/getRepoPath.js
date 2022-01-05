const { getTapPath, getPathFromConfig, getKegGlobalConfig } = require('@keg-hub/cli-utils')

// TODO: Migrate to cli-utils

/**
 * Get the path to a git repo
 * @param {Object} globalConfig - Global config object for the keg-cli
 * @param {Object} name - Name of the repo in the global config to get
 *
 * @returns {string} - path to a git repo || the current dir
 */
const getRepoPath = (name, globalConfig) => {
  globalConfig = globalConfig || getKegGlobalConfig()
  return name && (getPathFromConfig(globalConfig, name) || getTapPath(globalConfig, name))
}

module.exports = {
  getRepoPath
}