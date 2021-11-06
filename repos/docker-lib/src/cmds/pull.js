const { spawnProc } = require('../process')
const { Logger } = require('@keg-hub/cli-utils')
const { dockerCliPipe } = require('./dockerCli')
const { apiError } = require('../utils/error/apiError')

const { isStr } = require('@keg-hub/jsutils')

/**
 * Pulls a docker image from a provider to the local machine
 * @function
 * @param {string|Object} url - Url to pull the image from
 * @param {boolean} log - Log messages and docker commands
 * @param {boolean} skipError - Skip throwing an error if command fails
 *
 * @returns {boolean} True if the image could be pulled
 */
 const pull = async ({ url, log=true, skipError=false, pipe=false }) => {
  const toPull = isStr(url) ? { url, log, skipError } : url

  toPull.log && Logger.spacedMsg(`Pulling docker image from`, toPull.url)

  if(pipe){
    const { error, data, exitCode } = await dockerCliPipe(
      `docker pull ${toPull.url}`,
      { loading: { title: `- Downloading Image`, offMatch: [ `Status:` ] }},
      { filter: [toPull.url], log }
    )

    if(error.length || exitCode)
      return toPull.skipError
        ? { data, error, exitCode }
        : apiError(error)

    toPull.log && Logger.success(`\nFinished pulling ${toPull.url} from provider!\n`)
    return { data, error, exitCode }

  }
  else {
    const exitCode = await spawnProc(`docker pull ${toPull.url}`)
    if(exitCode)
      return toPull.skipError ? false : apiError(`docker push ${toPull.url}`)

    toPull.log && Logger.success(`\nFinished pulling ${toPull.url} from provider!\n`)

    return { exitCode }
  }
}

module.exports = {
  pull
}