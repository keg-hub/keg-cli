const { isStr } = require('@keg-hub/jsutils')
const { getRepoPath } = require('./getRepoPath')

/**
 * Simple path check that ensures it's a string and has a /
 * Will not work for directly reference paths that don't include ./
 * @param {string} item - To be check if its a path
 *
 * @returns {string|boolean} - Passed in item if it's a path, otherwise false
 */
const isPath = item =>  isStr(item) && item.includes('/') && item

/**
 * Finds the best path to use passed on the passed in params
 * @param {Object} params - Task params parsed into an object from the task options
 * @param {Object} globalConfig - Global config object for the keg-cli
 *
 * @returns {string} - Best path based on passed in arguments
 */
const resolveBestPath = (params, globalConfig) => {
  const {
    tap,
    path,
    local,
    context,
    location,
  } = params

  const pathRef = isPath(location) || isPath(local) || isPath(path)
  const locRef = tap || context

  return pathRef ||
    locRef && getRepoPath(locRef, globalConfig) ||
    process.cwd()
}

module.exports = {
  resolveBestPath
}