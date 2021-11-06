const fs = require('fs-extra')
const { limboify } = require('../utils/limboify')

/**
 * Reads a file from local HHD, and returns the contents
 * @function
 * @param {string} filePath - Path of the file to read
 * @param {string} [format=utf8] - Format of the file
 *
 * @returns {Promise|string} - Content of the file
 */
 const readFile = (filePath, format = 'utf8') => {
  return limboify(fs.readFile, filePath, format)
}

/**
 * Reads a file from local HHD, and returns the contents synchronously
 * @function
 * @param {string} filePath - Path of the file to read
 * @param {string} [format=utf8] - Format of the file
 *
 * @returns {Promise|string} - Content of the file
 */
const readFileSync = (filePath, format = 'utf8') => {
  return fs.readFileSync(filePath, (format = 'utf8'))
}

module.exports = {
  readFile,
  readFileSync
}