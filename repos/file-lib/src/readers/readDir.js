const fs = require('fs-extra')
const { limboify } = require('../utils/limboify')

/**
 * Reads the file content of a directory
 * @function
 * @param {string} dirPath - Path of directory to be read
 *
 * @returns {Array<string>} - Contents of the directory
 */
const readDir = dirPath => {
  return limboify(fs.readdir, dirPath)
}

module.exports = {
  readDir
}
