const fs = require('fs-extra')

/**
 * Copy a file or a directory
 * @param {string} from - file or directory path
 * @param {string} to - file or directory path (if 'from' is a file, 'to' cannot be a directory)
 * @param {boolean=} logError - If the command fails, should the app throw?
 *
 * @returns {boolean} - whether the cmd is successful or not
 */
 const copySync = (from, to, logError = false) => {
  try {
    fs.copySync(from, to)
    return true
  }
  catch (err) {
    logError &&
      console.error(`copySync error for path "${from} to ${to}"`, err.stack)
    return false
  }
}

module.exports = {
  copySync
}