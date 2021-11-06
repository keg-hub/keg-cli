const fs = require('fs-extra')
const { limboify } = require('./utils/limboify')

/**
 * Makes a directory at the passed in folderPath
 * @function
 * @param {string} folderPath - Folder path to create
 *
 * @returns {Promise|boolean} - Success creating the directory
 */
const mkDir = filePath => {
  return limboify(fs.mkdir, filePath, { recursive: true })
}

module.exports = {
  mkDir
}