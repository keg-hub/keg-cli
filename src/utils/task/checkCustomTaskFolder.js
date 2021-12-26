const path = require('path')
const { isArr, exists } = require('@keg-hub/jsutils')
const { Logger, error, fileSys} = require('@keg-hub/cli-utils')

const { throwError } = error
const { getFolderContent, pathExists } = fileSys

/**
 * Searches a path recursively for a file or folder by name
 * @param {string} context - Context or name of repo to get the location of
 * @param {string} name - Name of file to find
 * @param {boolean} [opts.full=true] - Should return the full path
 * @param {string} opts.type - Type of content to return (folder || file)
 * @param {Array} opts.exclude - File or folder to exclude
 * @param {Array} opts.include - File or folder to include
 *
 * @returns {Object} - Contains feature and steps local and remote locations 
 */
const findPathByName = async (contextPath, name, opts={}) => {
  const defExclude = [ 'node_modules', '.git', '.github', '.vscode' ]
  return getFolderContent(contextPath, {
    ...opts,
    include: [ name ],
    full: exists(opts.full) ? opts.full : true,
    recursive: exists(opts.recursive) ? opts.recursive : true,
    exclude: isArr(opts.exclude) ? opts.exclude.concat(defExclude) : defExclude,
  })
}

/**
 * Checks that a path exists locally
 * @param {string} toCheck - Path to check if it exists
 *
 * @returns {boolean} - If the path exists
 */
const checkPathExists = async toCheck => {
  // Check if the exists locally
  const [ error, exists ] = await pathExists(toCheck)
  return error ? throwError(error.message) : exists
}


/**
 * Checks if there is a tasks folder, to load the kegs custom tasks
 * @param {Object} tapObj - Config object for the linked tap
 * @param {string} tapObj.path - Path to the linked tap repo
 * @param {string} tapObj.tasks - Path to the custom tasks file 
 *
 * @returns {string} - Path to the custom tasks index.js file
 */
const checkCustomTaskFolder = async tapObj => {

  // Search for the tasks folder within the location path
  const pathNames = await findPathByName(
    path.join(tapObj.path),
    'tasks',
    { type: 'folder', recursive: false }
  )
  const [ foundPath ] = pathNames

  // Ensure we found a path to use
  if(!foundPath || !foundPath.length) return false

  // Check for the tasks index file
  const indexFile = path.join(foundPath, 'index.js')
  const indexFileExists = await checkPathExists(indexFile)

  // If a container/tasks folder but no index file, log a warning
  // Otherwise return the indexFile path
  return !indexFileExists
    ? Logger.warn(`Linked tap task folder exists, but index.js file is missing!`)
    : indexFile

}

module.exports = {
  checkCustomTaskFolder
}