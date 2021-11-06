const { isStr } = require('@keg-hub/jsutils')
const { dockerCliPipe } = require('./dockerCli')
const { apiError } = require('../utils/error/apiError')
const { Logger, runCmd } = require('@keg-hub/cli-utils')

/**
 * Pulls a docker image Piping the output to dockerCliPipe command
 * This allows tracking if a new image was pulled or not
 * @function
 * @param {string|Object} url - Url to pull the image from
 * @param {boolean} log - Log messages and docker commands
 * @param {boolean} skipError - Skip throwing an error if command fails
 *
 * @returns {Object} - The output and exitCode  of the dockerCliPipe command
 */
const pipePull = async ({ url, log, skipError }) => {

  const { error, data, exitCode } = await dockerCliPipe(
    `docker pull ${url}`,
    { loading: { title: `- Downloading Image`, offMatch: [ `Status:` ]}},
    { filter: [url], log }
  )

  ;(error.length || exitCode)
    ? !skipError && apiError(error)
    : log && Logger.success(`\nFinished pulling ${url} from provider!\n`)

  return {
    data,
    error,
    exitCode
  }
}

/**
 * Pulls a docker image using the passed in url
 * This allows tracking if a new image was pulled or not
 * @function
 * @param {string|Object} url - Url to pull the image from
 * @param {boolean} log - Log messages and docker commands
 * @param {boolean} skipError - Skip throwing an error if command fails
 *
 * @returns {Object} - The exitCode of the docker pull command
 */
const execPull = async ({ url, log, skipError }) => {
  const exitCode = await runCmd(`docker`, [` pull`, url])

  !exitCode
    ? log && Logger.success(`\nFinished pulling ${url} from provider!\n`)
    : !skipError
      ? apiError(`docker pull ${url}`)
      : false

  return { exitCode }
}

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

  return pipe ? await pipePull(toPull) : await execPull(toPull)
}

module.exports = {
  pull
}