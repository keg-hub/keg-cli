const { isArr, isStr, exists, isBool } = require('@keg-hub/jsutils')

/**
 * Loop over the passed in ENVs
 * Add them to the process.env if they don't already exist
 * @param {Object} addEnvs - Envs to add to the current process
 * @param {boolean|Array} overwrite - Should the env be overwritten if it already exists
 *                                    When an array, should be ENV's that are allowed to overwrite existing
 * 
 * @returns {Void}
 */
const addToProcess = (addEnvs, overwrite) => {
  Object.entries(addEnvs).map(([key, value]) => {
    exists(value) && (
      !exists(process.env[key]) ||
      isArr(overwrite) && overwrite.includes(key) ||
      isBool(overwrite) && overwrite
    ) &&
      (process.env[key] = value)
  })
}


/**
 * Returns a key-value command parameter string
 * @param {string} name - parameter name
 * @param {string} value - param value
 * @returns {string}
 * @example
 * addParam('foo', 2) => "--foo 2"
 */
const addParam = (name, value, ident=`--`) => name && exists(value)
  ? `${ident}${name} ${value}`
  : ''

/**
 * Returns a command's flag string
 * @param {string} name - flag name
 * @param {string} shouldAdd - if false, returns an empty string
 * @returns {string}
 * @example
 * addFlag('foo', true) => "--foo"
 * addFlag('foo', 'bar') => "--foo"
 * addFlag('foo') => "--foo"
 * addFlag('foo', false) => ""
 * addFlag('foo', null) => ""
 * addFlag('foo', undefined) => ""
 *
 * @returns {string} - Constructed flag as a string if valid args are passed
 */
const addFlag = (...args) => {
  const name = args[0]

  return !name || (args.length == 2 && !args[1])
    ? ''
    : `--${name}`
}

/**
 * Gets a string of space-separated string values
 * @param {Array<string>|string} values - either array of strings or csv
 * @returns {string} combined string
 */
const addValues = values => isArr(values)
  ? values.join(' ')
  : isStr(values)
    ? values.replace(/,/g, ' ')
    : ''

module.exports = {
  addFlag,
  addParam,
  addValues,
  addToProcess,
}