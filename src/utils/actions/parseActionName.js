
/**
 * Finds the name of the dependency based on passed in dependency || remotePath
 * @function
 * @param {string} dependency - Name to use as the dependency
 * @param {string} remotePath - Folder location within the docker container
 *
 * @returns {string} - Name of the dependency
 */
 const parseActionName = (dependency, remotePath) => {
  return dependency || remotePath
    .split(`/`)
    .pop()
    .split(`:`)
    .shift()
    .replace(/-_/gi, '')
}

module.exports = {
  parseActionName
}