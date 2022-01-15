const { addToProcess } = require('./addToProcess')
const { loadConfigs } = require('@keg-hub/parse-config')

/**
 * Loads envs  from .env and values files
 * Automatically adds them to the current processes envs unless disabled
 * @param {string} env - The node environment of the current process
 * @param {Array<string>} locations - Locations to look for .env and values files
 * @param {string} name - Name of the tap to load the envs fro
 * @param {boolean} [addToProc=true] - Should the loaded envs be added to the current process
 * 
 * @returns {Object} - Loaded ENVs object
 */
const loadEnvs = ({ env, name, locations, toProc}) => {
  const mergedEnvs = loadConfigs({
    env,
    name,
    locations,
  })

  // Add the loaded envs to the current process.env
  toProc && addToProcess(mergedEnvs)

  return mergedEnvs
}

module.exports = {
  loadEnvs,
}
