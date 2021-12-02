const { isStr, exists } = require('@keg-hub/jsutils')

const EXPAND_MATCH = /(.?\${?(?:[a-zA-Z0-9_]+)?}?)/g

/**
 * Checks the passed in env for variable expansion similar to how terminal/bash works
 * @param {Object} envs - Parsed envs
 * @param {string|boolean} env - Env to be checked for expansion
 * 
 * @example
 * process.env.SOME_ENV = 'some-value'
 * MY_ENV=${SOME_ENV} === MY_ENV='some-value'
 * 
 * @returns {string|boolean} - Replaced value expanded as needed
 */
const convertValue = (envs, env) => {
  return (env.match(EXPAND_MATCH) || [])
    .reduce((initialVal, match) => {
      const parts = /(.?)\${?([a-zA-Z0-9_]+)?}?/g.exec(match)
      const prefix = parts[1]

      let value
      let replacePart

      if (prefix === '\\') {
        replacePart = parts[0]
        value = replacePart.replace('\\$', '$')
      }
      else {
        const key = parts[2]
        replacePart = parts[0].substring(prefix.length)
        // Set precedence current envs then env file
        value = process.env[key] || envs[key] || ''
        // Check for recursive expansions
        value = convertValue(envs, value)
      }

      return initialVal.replace(replacePart, value)
    }, env)
}

/**
 * Checks the passed in env for variable expansion similar to how terminal/bash works
 * @param {Object} envs - Parsed envs
 *
 * @returns {Object} - Object with the envs expanded as needed 
 */
const expand = envs => {
  return Object.keys(envs)
    .reduce((acc, key) => {
      const val = exists(process.env[key]) ? process.env[key] : envs[key]
      acc[key] = isStr(val)
        ? convertValue(envs, val)
        : val

      return acc
    }, envs)
}

module.exports = {
  expand,
  convertValue
}