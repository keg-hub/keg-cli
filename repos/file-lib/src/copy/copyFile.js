const fs = require('fs-extra')
const { limboify } = require('../utils/limboify')

/**
 * Copies from one file path to another
 * @function
 * @param {string} from - Path to copy from
 * @param {string} to - Path to copy to
 * @param {string} [mode=1] - Copy mode - Should overwrite the file
 *
 * @returns {Promise} - Resolves after file has been copied
 */
const copyFile = (to, from, mode) => {
  return limboify(fs.copyFile, to, from, mode)
}

/**
 * Copies from one file path to another synchronously
 * @function
 * @param {string} from - Path to copy from
 * @param {string} to - Path to copy to
 * @param {string} [mode=1] - Copy mode - Should overwrite the file
 *
 * @returns {void}
 */
const copyFileSync = (from, to, mode) => fs.copyFileSync(from, to, mode)

module.exports = {
  copyFile,
  copyFileSync
}