const fs = require('fs-extra')
const { limboify } = require('./utils/limboify')

/**
 * Removes a file from the local files system
 * @function
 * @param {string} file - Path to the file to be removed
 *
 * @returns {void}
 */
 const removeDir = file => limboify(fs.remove, file)

 /**
  * Removes a file from the local files system synchronously
  * @function
  * @param {string} file - Path to the file to be removed
  *
  * @returns {void}
  */
 const removeDirSync = file => fs.removeSync(file)

module.exports = {
  removeDir,
  removeDirSync
}
