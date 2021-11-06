const fs = require('fs-extra')
const { limboify } = require('../utils/limboify')

/**
 * Checks if a path exists using fs.stat wrapped in a promise
 * @function
 * @param {string} path - Path to Check
 *
 * @returns {Promise|boolean} - True if the file exists
 */
 const stat = path => {
  return limboify(fs.stat, path)
}

module.exports = {
  stat
}
