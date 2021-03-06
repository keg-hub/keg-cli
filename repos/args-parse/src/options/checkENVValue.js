const { exists, get } = require('@keg-hub/jsutils')
const { getConfig } = require('../utils/getConfig')

/**
 * Check how envs should be loaded based on the config
 * @param {string} metaEnv - name of the env from the option meta data
 */
const useENVValues = (metaEnv) => {
  if(!metaEnv) return false

  const envName = metaEnv.trim()
  const envVal = process.env[envName]

  if(!envName || !exists(envVal)) return false

  const envSetting = get(getConfig(), 'settings.fromEnv')

  return !envSetting || envSetting === false || (envSetting === `not-empty` && envVal.trim() === ``)
    ? false
    : true
}

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
  return !exists(value) && useENVValues(metaEnv)
    ? process.env[metaEnv]
    : value
}

module.exports = {
  checkENVValue
}