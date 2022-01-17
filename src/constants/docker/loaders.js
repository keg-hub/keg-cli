const path = require('path')
const { containersPath } = require('./values')
const { noOpObj } = require('@keg-hub/jsutils')
const { constants } = require('@keg-hub/cli-utils')
const { loadConfigs } = require('@keg-hub/parse-config')
const { buildTemplateData } = require('KegUtils/template/buildTemplateData')

/**
 * Loads the config files for the passed in named container based on the current env
 * @function
 * @param {string} args.__internal - Internal config and path options
 * @param {string} args.env - Environment name to load the config files for
 * @param {string} args.name - Name of the container to build the config for
 *
 * @returns {Object} - Loaded ENVs for the current environment
*/
const loadConfigFiles = args => {
  const { name, __internal=noOpObj, ...configParams } = args
  const { injectPath, containerPath } = __internal

  const locations = []
  constants.INTERNAL_CONTAINERS.includes(name) &&
    locations.push(path.join(containersPath, name))

  injectPath && locations.push(injectPath)
  containerPath && locations.push(containerPath)
  
  return loadConfigs({
    name,
    locations,
    error: false,
    ...configParams,
    data: buildTemplateData(args),
  })
}


module.exports = {
  loadConfigFiles
}
