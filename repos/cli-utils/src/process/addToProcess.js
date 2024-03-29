/** @module Process */
const { exists, emptyObj, emptyArr } = require('@keg-hub/jsutils')

/**
 * Loop over the passed in ENVs, and add them to the current process
 * Add them to the process.env if they don't already exist
 * @function
 * @param {Object} addEnvs - Envs to add to the current process
 * @param {Object} options - Configure out the envs are added
 * @param {Object} options.force - Force add the env, even if it already exists
 *
 * @returns {Void}
 */
const addToProcess = (addEnvs, opts=emptyObj) => {
  const { force, ignore=emptyArr } = opts

  Object.entries(addEnvs)
    .map(([ key, value ]) => {
      exists(value)
        && !ignore.includes(key)
        && (!exists(process.env[key]) || force)
        && (process.env[key] = value)
    })
}

module.exports = {
  addToProcess
}