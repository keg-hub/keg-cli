/** @module FS */

const { tryRequireSync } = require('@keg-hub/jsutils/src/node')
const path = require('path')

/**
 * Gets the root path of a package by searching for the nearest `package.json` file up the file tree 
 * @function
 * @param {string} location - Location to start the search from
 * @returns {string} - root package directory of a path located at `location`, or else null if none exists
 */
 const getPackageRoot = location => {
  // base case at root directory
  if (location === '/')
    return null

  // check if the current location is the app root
  const nextPath = path.resolve(location, 'package.json')
  if (tryRequireSync(nextPath))
    return location

  // otherwise recurse up
  const parentPath = path.resolve(location, '..')
  return getPackageRoot(parentPath)
}

module.exports = { getPackageRoot }