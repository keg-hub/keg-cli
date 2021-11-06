const path = require('path')

/**
 * Wraps require in a try catch so app doesn't throw when require is called inline
 * @param {string} folder - The path to the file to require
 * @param {string} file - The file to require
 * @param {boolean} logError - If the require fails, should the app throw
 *
 * @returns {Object} - Content of the required file
 */
 const requireFile = (folder = '', file = '', logError) => {
  const location = path.join(folder, file)

  try {
    // Build the path to the file
    // load the data
    const data = require(location)

    return { data, location }
  }
  catch (err) {
    logError &&
      console.error(`requireFile error for path "${location}"`, err.stack)

    return {}
  }
}

module.exports = {
  requireFile
}