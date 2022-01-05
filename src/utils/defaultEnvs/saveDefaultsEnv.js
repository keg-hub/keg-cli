const path = require('path')
const { generalError } = require('../error/generalError')
const { constants, fileSys, Logger } = require('@keg-hub/cli-utils')

const { writeFile } = fileSys
const { NODE_ENV } = process.env
const { DEFAULT_ENV, GLOBAL_CONFIG_FOLDER } = constants
/**
 * Saves the Defaults.env file to the global config folder path
 * @param {string} content - Content to be saved to the defaults Envs file
 * @param {boolean} log - Should log any updates
 *
 * @returns {void}
 */
const saveDefaultsEnv = async (content, log) => {

  !content && generalError(`Can not save ${DEFAULT_ENV} with no content. This would remove all ENVs`)

  // Write the file to disk, overwriting the current defaults.env 
  NODE_ENV !== 'test' &&
    await writeFile(path.join(GLOBAL_CONFIG_FOLDER, '/', DEFAULT_ENV), content)

  log && Logger.success('\nGlobal ENVs saved!')

}

module.exports = {
  saveDefaultsEnv
}
