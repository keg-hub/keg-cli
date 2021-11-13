const path = require('path')
const { appRoot } = require('../../paths')
const { loadEnvs } = require('../envs/loadEnvs')
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
  const {envFile, env, ...cmdOpts} = opts

  const envs = loadEnvs(env, envFile ? [envFile] : undefined)
  const options = deepMerge({ env: envs, log: true }, cmdOpts)
  const cmdArgs = [...toArr(preArgs), cmd, ...toArr(postArgs)].filter(arg => arg)

  return await dockerCompose(cmdArgs, options, appRoot)
}

compose.up = (...args) => compose('up', ...args)
compose.down = (...args) => compose('down', ...args)
compose.rm = (...args) => compose('rm', ...args)

module.exports = {
  compose
}

