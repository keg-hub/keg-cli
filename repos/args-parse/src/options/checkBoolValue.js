const { getConfig } = require('../utils/getConfig')
const { exists, isStr, isBool } = require('@keg-hub/jsutils')

/**
 * Placeholder variable to cache the boolean options
 * @Array
 */
let __BOOL_OPTS

/**
 * Loads the boolean options from the config
 * @function
 *
 * @returns {Object} - Boolean options defined in the config
 */
const getBoolOptions = () => {
  const { bools } = getConfig()

  return {
    ...bools,
    all: bools.truthy.concat(bools.falsy)
  }
}

/**
 * Checks if the value is a string bool, and auto-converts it
 * @function
 * @param {*} value - Value to check for string bool
 *
 * @returns {*} - Boolean or original value
 */
const checkBoolValue = (value, metaType) => {

  const notBoolType = exists(metaType) && (metaType !== `boolean` && metaType !== `bool`)

  if(!exists(value) || isBool(value) || notBoolType) return value

  const lowerVal = isStr(value) && value.toLowerCase() || value
  const boolOpts = __BOOL_OPTS || getBoolOptions()

  // Check the value is one of the joined bool options
  return !boolOpts.all.includes(lowerVal)
    ? value
    : boolOpts.truthy.includes(lowerVal)
      ? true
      // Should not be needed, but adding incase I missed an edge case some how
      : boolOpts.falsy.includes(lowerVal)
        ? false
        : value
}

module.exports = {
  getBoolOptions,
  checkBoolValue
}
