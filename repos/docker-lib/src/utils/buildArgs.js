const {
  isObj,
  isStr,
  isArr,
  exists,
  noOpObj,
  reduceObj,
  noPropArr,
} = require('@keg-hub/jsutils')

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
 * Converts an array of items into an object when the items are strings of key=value pairs
 * @param {Array} arr - Items to be converted into an object
 * 
 * @returns {Object} - Array items converted into an object
 */
const arrToObj = arr => {
  return arr.reduce((acc, item) => {
    const [key, val] = item.split(`=`)
    cleanKey = key.trim()
    cleanVal = val.trim()
    cleanKey && exists(cleanVal) && (acc[cleanKey] = cleanVal)

    return acc
  })
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
  const buildEnvs = isObj(envs) ? envs : isArr(envs) ? arrToObj(envs) : false
    
  return !isObj(buildEnvs) || !Object.values(buildEnvs).length
    ? cmd
    : reduceObj(
        buildEnvs,
        (key, value, buildCmd) => asBuildArg(key, value, buildCmd, filters),
        cmd
      ).trim()
}


module.exports = {
  asBuildArg,
  toBuildArgs,
}
