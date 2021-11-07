const { pickKeys, isArr, isStr, noOpObj } = require('@keg-hub/jsutils')

/**
 * Normalizes the passed in arguments to match a consistent format
 * @param {string} main - The main key of the method that called this function
 * @param {Object|string} value - The value that main should be in the returned object
 * @param {Object} options - Extra options passed to the function
 * @param {Array} keys - The properties that should exist on the returned object
 */
const formatParams = (main, value, keys, options=noOpObj) => {

  const built = isStr(value) ? { ...options, [main]: value } : value
  if(!isArr(keys)) return built
  
  const include = keys.includes(main) ? keys : [...keys, main]

  return pickKeys(built, include)
}

module.exports = {
  formatParams
}