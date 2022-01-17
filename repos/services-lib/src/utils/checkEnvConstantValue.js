const { exists, get } = require('@keg-hub/jsutils')

/**
 * Checks if a constant env matches the passed in matchValue
 * If no matchValue is passed, then the value is returned
 * @function
 * @param {string} context - The container context to pull the ENVs from
 * @param {string} constant - The ENV constant to check
 * @param {*} matchValue - The value the ENV constant is checked against
 *
 * @returns {boolean} - If the ENV constant matches the matchValue or exists when no matchValue
 */
const checkEnvConstantValue = (contextData, constant, matchValue) => {
  const value = get(contextData, `envs.${constant}`)

  return exists(matchValue)
    ? value === matchValue
    : Boolean(value)
}

module.exports = {
  checkEnvConstantValue
}