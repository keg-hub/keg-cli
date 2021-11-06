const fs = require('fs-extra')
const path = require('path')
const { isFunc } = require('@keg-hub/jsutils')
const { defaultFileExclude } = require('../constants/constants')

/**
 * Gets the content of a folder based on passed in options
 * @function
 * @param {string} fromPath - Path to get the content from
 * @param {Array} allFound  - Past found file paths
 * @param {string} file - File path to check if should be added to allFound array
 * @param {boolean} opts.full - Should return the full path
 * @param {string} opts.type - Type of content to return (folder || file)
 * @param {Array} opts.exclude - File or folder to exclude
 * @param {Array} opts.include - File or folder to include
 *
 * @returns {Array} - Array of found file paths
 */
 const buildFoundArray = ({
  allFound,
  recurCall,
  file,
  fromPath,
  opts = {},
}) => {
  const { exclude = defaultFileExclude, full, include = [], recursive, type } = opts

  // Filter out any folder matching the exclude
  if (!file || exclude.indexOf(file) !== -1) return allFound

  // Get the full path of the file or folder
  const fullPath = path.join(fromPath, file)

  // Check if we should use the full path or relative
  const found = full ? fullPath : file

  // Check if its a directory
  const isDir = fs.statSync(fullPath).isDirectory()

  // Check if found should be added to the array based on the passed in arguments
  // Check the for type match or no type
  ;(!type || (type === 'folder' && isDir) || (type !== 'folder' && !isDir)) &&
    (!include.length || include.indexOf(file) !== -1) &&
    allFound.push(found)

  return !isDir || !recursive || !isFunc(recurCall)
    ? allFound
    : recurCall(fullPath, opts, allFound)
}

module.exports = {
  buildFoundArray
}