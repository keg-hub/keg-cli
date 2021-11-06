const { getFolderContent, getFolderContentSync } = require('./getFolderContent')

/**
 * Gets all folders in a directory path
 * @function
 * @param {string} fromPath - Path to find the folders in
 * @param {Object} [opts={}] - Options for filtering the found content
 * @param {boolean} opts.full - Should return the full path
 * @param {string} opts.type - Type of content to return (folder || file)
 * @param {Array} opts.exclude - File or folder to exclude
 * @param {Array} opts.include - File or folder to include
 *
 * @returns {Array} - All folders found in the path
 */
 const getFolders = (fromPath, opts) => {
  return getFolderContent(fromPath, { ...opts, type: 'folder' })
}

/**
 * Gets all folders in a directory path synchronously
 * @function
 * @param {string} fromPath - Path to find the folders in
 * @param {Object} [opts={}] - Options for filtering the found content
 * @param {boolean} opts.full - Should return the full path
 * @param {string} opts.type - Type of content to return (folder || file)
 * @param {Array} opts.exclude - File or folder to exclude
 * @param {Array} opts.include - File or folder to include
 *
 * @returns {Array} - All folders found in the path
 */
 const getFoldersSync = (fromPath, opts = {}) => {
  return getFolderContentSync(fromPath, { ...opts, type: 'folder' })
}

module.exports = {
  getFolders,
  getFoldersSync
}