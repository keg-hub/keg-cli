const fs = require('fs-extra')
const { limboify } = require('./utils/limboify')

/**
 * Writes a file to the local HHD
 * @function
 * @param {string} filePath - Path to where the file should be written
 * @param {*} data - Contents to be written to the file
 * @param {string} [format=utf8] - Format of the file
 *
 * @returns {Promise|boolean} - True if the file was written successfully
 */
const writeFile = (filePath, data, format = 'utf8') => {
  return limboify(fs.writeFile, filePath, data, format)
}

/**
 * Writes a file to the local HHD synchronously
 * @function
 * @param {string} filePath - Path to where the file should be written
 * @param {*} data - Contents to be written to the file
 * @param {string} [format=utf8] - Format of the file
 *
 * @returns {Promise|boolean} - True if the file was written successfully
 */
const writeFileSync = (filePath, data, format = 'utf8') => {
  return fs.writeFileSync(filePath, data, format)
}

module.exports = {
  writeFile,
  writeFileSync
}