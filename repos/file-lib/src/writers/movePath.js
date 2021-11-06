const fs = require('fs-extra')
const { limboify } = require('./utils/limboify')

/**
 * Copy a file from one location to another
 * @function
 * @param {*} oldPath - Copy from location
 * @param {*} newPath - Copy to location
 *
 * @returns {Promise|*} - Success response of fs.rename method
 */
 const movePath = (oldPath, newPath) => {
  return limboify(fs.rename, oldPath, newPath)
}
