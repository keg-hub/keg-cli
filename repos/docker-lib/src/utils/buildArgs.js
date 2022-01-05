
const { isObj, reduceObj, isStr, isArr, noPropArr, noOpObj } = require('@keg-hub/jsutils')

/**
 * Converts a key and value into docker build-args ( --build-arg key=value )
 * @function
 * @param {Object} key - Name of the build-arg
 * @param {Object} value - value of the build-arg
 * @param {string} [cmd=''] - Cmd to add the build-args to
 * @param {Array} [filters=[]] - Filter out specific envs items
 *
 * @returns {string} - Passed in cmd, with the key/value converted to docker build-args
 */
const asBuildArg = (key, value, cmd='', filters) => {
  filters = isArr(filters) ? filters : noPropArr

  value = isStr(value) && value.includes(' ') ? `"${value}"` : value
  
  return !filters.includes(key) && value
    ? `${cmd} --build-arg ${ key }=${ value }`.trim()
    : cmd
}

/**
 * Converts an object into docker build-args ( --build-arg key=value )
 * @function
 * @param {Object} [envs={}] - Envs to be converted
 * @param {string} [cmd=''] - Cmd to add the build-args to
 * @param {Array} [filters=[]] - Filter out specific envs items
 *
 * @returns {string} - Passed in cmd, with the envs converted to docker build-args
 */
const toBuildArgs = (envs=noOpObj, cmd='', filters=noPropArr) => {
  return !isObj(envs)
    ? cmd
    : reduceObj(
        envs,
        (key, value, buildCmd) => asBuildArg(key, value, buildCmd, filters),
        cmd
      ).trim()
}


module.exports = {
  asBuildArg,
  toBuildArgs,
}
