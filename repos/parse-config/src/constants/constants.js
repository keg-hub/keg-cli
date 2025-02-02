const path = require('path')
const homeDir = require('os').homedir()
const { deepFreeze } = require('@keg-hub/jsutils')

const {
  KEG_CONFIG_FILE,
  KEG_CONFIG_FOLDER,
  KEG_GLOBAL_CONFIG,
} = process.env

// The default global config path and config file
let GLOBAL_CONFIG_FILE = KEG_CONFIG_FILE || 'cli.config.json'
let GLOBAL_CONFIG_FOLDER = KEG_CONFIG_FOLDER || path.join(homeDir, '.kegConfig')

// If the global config path is passed in as an ENV, use that instead
if (KEG_GLOBAL_CONFIG && (!KEG_CONFIG_FILE || !KEG_CONFIG_FOLDER)) {
  const configPathSplit = KEG_GLOBAL_CONFIG.split('/')
  GLOBAL_CONFIG_FILE = configPathSplit.pop()
  GLOBAL_CONFIG_FOLDER = configPathSplit.join('/')
}


module.exports = deepFreeze({
  /**
   * Global config folder path
   * @string
   */
  GLOBAL_CONFIG_FOLDER,
  /**
   * Global config file name
   * @string
   */
  GLOBAL_CONFIG_FILE
})
