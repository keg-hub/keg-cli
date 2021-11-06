const fs = require('fs-extra')
const { limboify } = require('./utils/limboify')

/**
 * Checks if a file path exists on the local HHD
 * @function
 * @param {string} checkPath - Path to check if exists
 *
 * @returns {Promise|boolean} - True if the path exists, false if not
 */
const pathExists = checkPath => {
  return limboify(fs.access, checkPath, fs.constants.F_OK)
}

/**
 * Checks if a file path exists on the local HHD
 * @function
 * @param {string} checkPath - Path to check if exists
 *
 * @returns {Promise|boolean} - True if the path exists, false if not
 */
const pathExistsSync = checkPath => fs.existsSync(checkPath)

module.exports = {
  pathExists,
  pathExistsSync
}