
const { isArr, isObj, reduceObj, noPropArr, noOpObj } = require('@keg-hub/jsutils')

/**
 * Converts a key and value into docker env ( -e key=value )
 * @function
 * @param {Object} key - Name of the env
 * @param {Object} value - value of the env
 * @param {string} [cmd=''] - Cmd to add the env to
 * @param {Array} [filters=[]] - Filter out specific envs items
 *
 * @returns {string} - Passed in cmd, with the key/value converted to docker env
 */
const asContainerEnv = (key, value, cmd='', filters) => {
  filters = isArr(filters) ? filters : noPropArr

  return !filters.includes(key) && value
    ? `${cmd} -e ${ key }=${ value }`.trim()
    : cmd
}

/**
 * Converts an object into docker run envs ( -e key=value )
 * @function
 * @param {Object} [envs={}] - Envs to be converted
 * @param {string} [cmd=''] - Cmd to add the Envs to
 * @param {Array} [filters=[]] - Filter out specific envs items
 *
 * @returns {string} - Passed in cmd, with the envs converted to docker envs
 */
const toContainerEnvs = (envs=noOpObj, cmd='', filters=noPropArr) => {
  return !isObj(envs)
    ? cmd
    : reduceObj(
        envs,
        (key, value, buildCmd) => asContainerEnv(key, value, buildCmd, filters),
        cmd
      ).trim()
}

module.exports = {
  asContainerEnv,
  toContainerEnvs,
}
