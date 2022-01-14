const { noOpArr, noOpObj } = require('@keg-hub/jsutils')
const { apiError } = require('../utils/error/apiError')
const { Logger, runCmd } = require('@keg-hub/cli-utils')
const { ensureDocker } = require('../utils/ensureDocker')

/**
 * Adds the correct build command to the command string
 * Also ensures docker is added to the command
 * @param {boolean} buildX - True if buildX should be added to the command
 * @param {boolean} push - True if the image should be pushed to the docker provider
 * 
 * @param {string} - Docker build command as a string
 */
const getBuildCmd = (buildX, push) => {
  const buildCmd = [`build`]
  if(!buildX) return buildCmd

  buildCmd.unshift(`buildx`)
  // buildx requires it the image being pushed to automatically join the platform manifests
  // So add check to see if it should be included
  // Otherwise add load, to autoload it into the docker context
  push ? buildCmd.push(`--push`) : buildCmd.push(`--load`)

  return buildCmd.join(` `)
}


module.exports = {
  getBuildCmd
}