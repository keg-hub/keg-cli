const { exists } = require('@keg-hub/jsutils')

/**
 * If the option meta-data has an env set, then check if it exists, and use it's value
 * IMPORTANT - If no value exists, and meta.env does exist
 *             It will return meta.env
 * @function
 * @param {string} value - Data passed from cmd line
 * @param {string} metaEnv - Metadata ENV to check for
 *
 * @return {string} - Found value from value param or process.env[metaEnv]
 */
const checkENVValue = (value, metaEnv) => {
  return !exists(value) && exists(process.env[metaEnv])
    ? process.env[metaEnv]
    : value
}

module.exports = {
  checkENVValue
}