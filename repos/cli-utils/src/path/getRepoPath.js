const { getTapPath } = require('../tap/getTapPath')
const { getPathFromConfig } = require('../globalConfig/getPathFromConfig')
const { getKegGlobalConfig } = require('../globalConfig/getKegGlobalConfig')

/**
 * Get the path to a git repo
 * @param {Object} globalConfig - Global config object for the keg-cli
 * @param {Object} name - Name of the repo in the global config to get
 *
 * @returns {string} - path to a git repo || the current dir
 */
const getRepoPath = (name, globalConfig=getKegGlobalConfig()) => {
  return name && (getPathFromConfig(globalConfig, name) || getTapPath(name, globalConfig))
}

module.exports = {
  getRepoPath
}
