const { spawnProc } = require('../process')
const { Logger } = require('@keg-hub/cli-utils')
const { apiError } = require('../utils/error/apiError')

const { isStr } = require('@keg-hub/jsutils')


/**
 * Pushes a local docker image to the docker provider base on the url
 * @function
 * @param {string|Object} url - Url to push the image to
 * @param {boolean} log - Log messages and docker commands
 * @param {boolean} skipError - Skip throwing an error if command fails
 *
 * @returns {boolean} True if the image could be pushed
 */
 const push = async (url, log, skipError) => {
  const toPush = isStr(url)  ? { url, log, skipError } : url

  toPush.log && Logger.spacedMsg(`Pushing docker image to`, toPush.url)

  const exitCode = await spawnProc(`docker push ${toPush.url}`)

  if(exitCode)
    return toPush.skipError ? false : apiError(`docker push ${toPush.url}`)

  toPush.log && Logger.success(`\nFinished pushing ${toPush.url} to provider!\n`)

  return exitCode
}

module.exports = {
  push
}