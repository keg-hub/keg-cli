const fs = require('fs-extra')
const { limboify } = require('./utils/limboify')

/**
 * Removes a file from the local files system
 * @function
 * @param {string} file - Path to the file to be removed
 *
 * @returns {void}
 */
 const removeFile = file => limboify(fs.unlink, file)

 /**
  * Removes a file from the local files system synchronously
  * @function
  * @param {string} file - Path to the file to be removed
  *
  * @returns {void}
  */
 const removeFileSync = file => fs.unlinkSync(file, callbackFunction)

module.exports = {
  removeFile,
  removeFileSync
}
