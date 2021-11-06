
const { reduceObj } = require('@keg-hub/jsutils')

/**
 * Converts a key and value into docker env ( -e key=value )
 * @function
 * @param {Object} key - Name of the env
 * @param {Object} value - value of the env
 * @param {string} [cmd=''] - Cmd to add the env to
 *
 * @returns {string} - Passed in cmd, with the key/value converted to docker env
 */
const asContainerEnv = (key, value, cmd='') => {
  return value && `${cmd} -e ${ key }=${ value }`.trim() || cmd
}

/**
 * Converts an object into docker run envs ( -e key=value )
 * @function
 * @param {Object} [envs={}] - Envs to be converted
 * @param {string} [cmd=''] - Cmd to add the Envs to
 *
 * @returns {string} - Passed in cmd, with the envs converted to docker envs
 */
const toContainerEnvs = (envs={}, cmd='') => {
  return reduceObj(envs, asContainerEnv, cmd).trim()
}

module.exports = {
  asContainerEnv,
  toContainerEnvs,
}
