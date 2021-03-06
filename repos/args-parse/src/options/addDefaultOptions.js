const { getConfig } = require('../utils/getConfig')

/**
 * Adds the default options defined in the config to the passed in options
 * @param {Object} options - Original options object to be joined with the config options
 *
 * @returns {Object} - Joined config options with the passed in options 
 */
const addDefaultOptions = (options={}) => {
  const { defaultArgs } = getConfig()
  if(!defaultArgs) return options

  return Object.entries(defaultArgs)
    .reduce((updated, [ name, meta ]) => {
      // Only set the default option, if it does not already exist
      if(!updated[name]) updated[name] = meta
      
      return updated
    }, { ...options })

}

module.exports = {
  addDefaultOptions
}
