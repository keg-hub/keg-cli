const { appRoot } = require('../../paths')
const { dockerCompose } = require('@keg-hub/cli-utils')
const { noOpObj, noPropArr, isStr, deepMerge } = require('@keg-hub/jsutils')

/**
 * Converts the passed in args to an array if it's a string
 * @param {Array<string>|string} args - To be converted into an array
 * 
 * @return {Array<string>} - The args converted into an array
 */
const toArr = args => {
  return [...(isStr(args) ? args.split(' ') : args)]
}

/**
 * Runs a docker-compose command
 * @param {string} cmd - Docker-Compose command to run
 * @param {Array<string>|string} args - arguments of the command
 * @param {Object} opts - Options to pass to the spawned child process
 * 
 * @returns {*} - Response from the spawned child process
 */
const compose = async (cmd, preArgs=noPropArr, postArgs=noPropArr, opts=noOpObj) => {
  const {envs, env, ...cmdOpts} = opts
  const options = deepMerge({ env: envs, log: true }, cmdOpts)

  const cmdArgs = [
    ...toArr(preArgs),
    cmd,
    ...toArr(postArgs)
  ].filter(arg => arg)

  return await dockerCompose(
    cmdArgs,
    options,
    appRoot
  )
}


const convertFromObj = (cmd, composeOpts, cmdOpts=noOpObj) => {
  const {
    file,
    files,
    recreate,
  } = composeOpts
  
}

/**
 * Wraps the compose function and validates the passed in arguments
 * This allows calling the compose method with different argument structures based on needs
 * @example
 * compose.up(`-f /path/to/docker-compose.yml`)
 */
const composeWrap = (cmd, preArgs=noPropArr, postArgs, opts) => {
  const passArgs = []

  // Ensure first argument is an array
  isArr(preArgs)
    ? passArgs.push(preArgs)
    : isStr(preArgs)
      ? passArgs.push(toArr(preArgs))
      : isObj(preArgs) && !isObj(opts)
        ? passArgs.push(...convertFromObj(cmd, preArgs, postArgs))
        : passArgs.push(noPropArr)

  // Ensure second argument is an array
  !isObj(preArgs) && isArr(postArgs)
    ? passArgs.push(postArgs)
    : isStr(preArgs)
      ? passArgs.push(toArr(preArgs))
      : isObj(preArgs)
        ? passArgs.push(noPropArr, postArgs)
        : passArgs.push(noPropArr)

  // Ensure third argument is an object
  passArgs.length !== 3 && isObj(opts)
    ? passArgs.push(opts)
    : passArgs.push(noPropObj)

  // Call the compose command
  return compose(cmd, ...passArgs)
}

compose.up = (...args) => composeWrap('up', ...args)
compose.down = (...args) => composeWrap('down', ...args)
compose.rm = (...args) => composeWrap('rm', ...args)
compose.pull = (...args) => composeWrap('pull', ...args)

module.exports = {
  compose
}

