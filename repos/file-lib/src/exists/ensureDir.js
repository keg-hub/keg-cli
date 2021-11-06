const fs = require('fs-extra')
const { limboify } = require('../utils/limboify')

/**
 * Ensures a directory exists
 * @param {string} dirPath - path to ensure
 *
 * @return {string} - directory path that was ensured
 */
 const ensureDirSync = (dirPath = '', logError) => {
  try {
    // make the directory if it doesn't exist
    !fs.existsSync(dirPath) && fs.mkdirSync(dirPath)

    return dirPath
  }
  catch (err) {
    logError &&
      console.error(`ensureDirSync error for path "${dirPath}"`, err.stack)
    return false
  }
}

module.exports = {
  ensureDirSync
}