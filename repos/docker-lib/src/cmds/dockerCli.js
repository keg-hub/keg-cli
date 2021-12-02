const { pipeCmd } = require('../process')
const { asJson } = require('../utils/output/asJson')
const { apiError } = require('../utils/error/apiError')
const { Logger, execCmd } = require('@keg-hub/cli-utils')
const { ensureDocker } = require('../utils/ensureDocker')

const {
  isArr,
  toStr,
  noPropArr,
  noOpObj,
} = require('@keg-hub/jsutils')

/**
 * Calls the docker cli from the command line and returns the response
 * @function
 * @param {Object} params - arguments used to modify the docker api call
 * @param {Object} params.opts - optional arguments to pass to the docker command
 * @param {Object} params.asObj - Return the response as an unformatted string
 * @param {Object} params.log - Log the docker command being run before running it
 * @param {Object} params.skipError - Skip showing an error if the docker command fails
 * @param {Object} [params.format=''] - Format the output of the docker command
 * @param {Object} params.force - Pass "--force" to the docker command, to force the operation
 * @param {Object} params.errResponse - On an error calling docker, this will be returned.
 *                                      If errResponse is undefined, the current process will exit
 *
 * @returns {Promise<string|Array>} - JSON array of items || stdout from docker cli call
 */
 const dockerCli = async (params={}, cmdOpts={}) => {
  const { opts, errResponse, log, skipError, format='', force } = params

  const options = isArr(opts) ? opts.join(' ').trim() : toStr(opts)
  const useFormat = format === 'json' ? `--format "{{json .}}"` : format
  const useForce = force ? '--force' : ''

  const cmdToRun = ensureDocker(`${ options } ${ useForce } ${ useFormat }`.trim())

  log && Logger.spacedMsg(`Running command: `, cmdToRun)

  const { error, data } = await execCmd(
    cmdToRun,
    cmdOpts
  )

  return error
    ? apiError(error, errResponse, skipError)
    : format === 'json'
      ? asJson(data, skipError)
      : data

}


/**
 * Creates a child process and pipes the output to the current process
 * @function
 * @param {string} cmd - Command to run
 * @param {string} args - Arguments to pass to the child process
 * @param {string} pullUrl - Url of the docker image
 * @param {boolean} log - Log messages and docker commands
 *
 * @returns {Object} - Output of the commands std out/err and exitCode
 */
 const cliPipe = (cmd, args=noOpObj, options=noOpObj) => {
  const { filter=noPropArr, log=true } = options

  return new Promise(async (res, rej) => {
    const output = { data: [], error: [] }

    await pipeCmd(cmd, {
      ...args,
      loading: {
        active: true,
        type: 'bouncingBall',
        ...args.loading,
      },
      onStdOut: data => {
        log &&
          !filter.includes(data.trim()) &&
          Logger.stdout(data)

        output.data.push(data)
      },
      onStdErr: data => {
        log && Logger.stderr(data)
        output.error.push(data)
      },
      onError: data => {
        log && Logger.stderr(data)
        output.error.push(data)
      },
      onExit: (exitCode) => (
        res({
          data: output.data.join(''),
          error: output.error.join(''),
          exitCode,
        })
      )
    })
  })
}

module.exports = {
  cliPipe,
  dockerCli,
}