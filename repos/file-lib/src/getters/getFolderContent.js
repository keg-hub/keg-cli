const fs = require('fs-extra')
const { readDir }  = require('../readers/readDir')
const { throwError } = require('../utils/throwError')
const { buildFoundArray } = require('../utils/buildFoundArray')

/**
 * Gets the content of a folder based on passed in options
 * @function
 * @param {string} fromPath - Path to get the content from
 * @param {Object} [opts={}] - Options for filtering the found content
 * @param {boolean} opts.full - Should return the full path
 * @param {string} opts.type - Type of content to return (folder || file)
 * @param {Array} opts.exclude - File or folder to exclude
 * @param {Array} opts.include - File or folder to include
 *
 * @returns {Promise|Array} - Array of found items
 */
 const getFolderContent = async (fromPath, opts = {}, foundPaths = []) => {
  const [ err, allFiles ] = await readDir(fromPath)
  err && throwError(err)

  return allFiles.reduce(async (toResolve, file) => {
    const allFound = await toResolve

    return buildFoundArray({
      opts,
      file,
      fromPath,
      allFound,
      recurCall: getFolderContent,
    })
  }, Promise.resolve(foundPaths))
}


/**
 * Gets the content of a folder based on passed in options synchronously
 * @function
 * @param {string} fromPath - Path to get the content from
 * @param {Object} [opts={}] - Options for filtering the found content
 * @param {boolean} opts.full - Should return the full path
 * @param {string} opts.type - Type of content to return (folder || file)
 * @param {Array} opts.exclude - File or folder to exclude
 * @param {Array} opts.include - File or folder to include
 *
 * @returns {Promise|Array} - Array of found items
 */
 const getFolderContentSync = (fromPath, opts = {}, foundPaths = []) => {
  return fs.readdirSync(fromPath).reduce(
    (allFound, file) =>
      buildFoundArray({
        opts,
        file,
        fromPath,
        allFound,
        recurCall: getFolderContentSync,
      }),
    foundPaths
  )
}

module.exports = {
  getFolderContent,
  getFolderContentSync
}