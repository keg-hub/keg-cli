
const { isObj, reduceObj } = require('@keg-hub/jsutils')

/**
 * Converts a key and value into docker build-args ( --build-arg key=value )
 * @function
 * @param {Object} key - Name of the build-arg
 * @param {Object} value - value of the build-arg
 * @param {string} [cmd=''] - Cmd to add the build-args to
 *
 * @returns {string} - Passed in cmd, with the key/value converted to docker build-args
 */
const asBuildArg = (key, value, cmd='', filters=[]) => {
  return !filters.includes(key) && value
    ? `${cmd} --build-arg ${ key }=${ value }`.trim()
    : cmd
}

/**
 * Converts an object into docker build-args ( --build-arg key=value )
 * @function
 * @param {Object} [envs={}] - Envs to be converted
 * @param {string} [cmd=''] - Cmd to add the build-args to
 *
 * @returns {string} - Passed in cmd, with the envs converted to docker build-args
 */
const toBuildArgs = (envs={}, cmd='', filters=[]) => {
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
