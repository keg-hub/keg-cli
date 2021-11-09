const path = require('path')
const { loadYmlSync } = require('../yml/yml')
const { loadEnvSync } = require('../env/env')
const { constants, getAppRoot } = require('@keg-hub/cli-utils')
const { noPropArr, noOpObj, exists, get } = require('@keg-hub/jsutils')

const { GLOBAL_CONFIG_FOLDER } = constants

/**
 * Adds the override value to the passed in location
 * @function
 * 
 * @param {string} location - Location on the local file system
 * @param {string} [override=container] - To be added to the location
 * 
 * @returns {string} - Location with the override added
 */
const addContainerDir = (location, override=`container`) => {
  return location && path.join(location, override)
}

/**
 * Gets all locations relative to the app root if it exists
 * @function
 * 
 * @returns {Object|boolean} - App paths if it exists or false
 */
const getAppLocations = () => {
  const appRoot = getAppRoot()
  const cwd = process.cwd()

  const appLocs = !appRoot || path.normalize(cwd) !== path.normalize(appRoot)
    ? [cwd]
    : []

  return appRoot
    ? [...appLocs, appRoot, addContainerDir(appRoot)]
    : appLocs
}

/**
 * Builds the yml file names in order of priority
 * @param {string} file - The reference name of the values file
 * @param {string} opts.env - The current environment
 * @param {string} opts.name - The name of the app the values file belongs to
 * 
 * @return {Array} - Builtfiles names
 */
const buildYmlFiles = (file='values', { env, name }) => {
  return  (['yml', 'yaml']).reduce((acc, ext) => {

    acc.push(`${file}.${ext}`)
    env && acc.push(`${env}.${ext}`)
    name && acc.push(`${name}.${ext}`)

    env && acc.push(`${file}_${env}.${ext}`)
    name && acc.push(`${file}_${name}.${ext}`)
    name && env && acc.push(`${file}_${name}_${env}.${ext}`)

    env && acc.push(`${file}.${env}.${ext}`)
    name && acc.push(`${file}.${name}.${ext}`)
    name && env && acc.push(`${file}.${name}.${env}.${ext}`)

    env && acc.push(`${file}-${env}.${ext}`)
    name && acc.push(`${file}-${name}.${ext}`)
    name && env && acc.push(`${file}-${name}-${env}.${ext}`)

    return acc
  }, [])
}

/**
 * Builds the env file names in order of priority
 * @param {string} opts.env - The current environment
 * @param {string} opts.name - The name of the app the values file belongs to
 *
 * @return {Array} - Built files names
 */
const buildEnvFiles = ({env, name}) => {
  const files = [`.env`, `defaults.env`]

  env && files.push(`${env}.env`)
  name && files.push(`${name}.env`)
  name && env && files.push(`${name}.${env}.env`)
  name && env && files.push(`${name}-${env}.env`)

  env && files.push(`.env.${env}`)
  name && files.push(`.env.${name}`)
  name && env && files.push(`.env.${name}.${env}`)
  name && env && files.push(`.env.${name}-${env}`)

  return files
}

/**
 * Builds the config file names for env and yaml files
 * @param {string} yamlName - The reference name of the values file
 * @param {string} opts.env - The current environment
 * @param {string} opts.name - The name of the app the values file belongs to
 *
 * @return {Array} - Built files names
 */
const buildFileNames = ({yamlName, env, name}) => {
  env = env || process.env.NODE_ENV

  const ymlFiles = buildYmlFiles(yamlName, {env, name})
  const envFiles = buildEnvFiles({env, name})

  return {
    yml: ymlFiles,
    env: envFiles
  }
}

/**
 * Generates the full locations for the yml and env files to load
 * @return {Object} - Contains the yam and env file locations to load
 */
const generateLocPath = (locations, defLocs, fileNames) => {

  const builtYmlLocs = fileNames.yml.reduce((acc, fileName) => {
    fileName &&
      defLocs.map(loc => loc && acc.push(path.join(loc, fileName)))

    fileName &&
      locations.map(loc => loc && acc.push(path.join(loc, fileName)))
    return acc
  }, [])

  const builtEnvLocs = fileNames.env.reduce((acc, fileName) => {
    fileName &&
      defLocs.map(loc => loc && acc.push(path.join(loc, fileName)))

    fileName &&
      locations.map(loc => loc && acc.push(path.join(loc, fileName)))
    return acc
  }, [])

  return {
    yml: builtYmlLocs,
    env: builtEnvLocs,
  }
}

/**
 * Generates the paths to load configuration files from
 * @function
 * @param {Array<string>} location - Custom locations to generate the location from
 * @param {Array<string>} types - Custom types to add to the paths
 * 
 * @return {Object} - Contains the yam and env file locations to load
 */
const generateLoadPaths = ({locations=noPropArr, ...opts}) => {
  const fileNames = buildFileNames(opts)
  const defLocs = [...getAppLocations(), GLOBAL_CONFIG_FOLDER]

  return generateLocPath(locations, defLocs, fileNames)
}


/**
 * Loads yml and env configs
 * First generates all possible locations
 * Then based on the extension type, loads it's content
 * @param {Object} config - Settings for loading the config files
 * @param {string} config.env - The current environment
 * @param {string} config.location - Path to the ENV file
 * @param {boolean} [config.error=true] - Should errors be thrown
 * @param {RegEx} config.pattern - Pattern to match against template values
 * @param {boolean} config.fill - Should the content be treated as a template
 * @param {boolean} [config.noEnv=false] - If true env files will not be loaded
 * @param {boolean} [config.noYml=false] - If true yml files will not be loaded
 * @param {string} config.name - The name of the app the values file belongs to
 * @param {string} config.data - Data to fill the config files if they are templates
 * @param {string} config.format - Type that should be returned (string || Object)
 * @param {string} [config.yamlName='values'] - The reference name of the values file
 * @param {Array<string>|string} [config.ymlPath='env'] - Path to the env that exist on the yml object
 * 
 * @return {Object} - Loaded config file ENVs
 */
const loadConfigs = (config=noOpObj) => {

  const { noYml, noEnv } = config
  const loadFrom = generateLoadPaths(config)

  const ymlPath = exists(config.ymlPath) ? config.ymlPath : 'env'

  // Load the yml files
  const ymlValues = noYml
    ? noOpObj
    : loadFrom.yml.reduce((acc, location) => {
        const content = loadYmlSync({ ...config, error: false, location })
        return {
          ...acc,
          ...(ymlPath ? get(content, ymlPath) : content)
        }
      }, {})

  // Load the env files, and merge with the yml files
  return noEnv
    ? ymlValues
    : loadFrom.env.reduce((acc, location) => {
        return {
          ...acc,
          ...loadEnvSync({ ...config, error: false, location }),
        }
      }, ymlValues)

}

module.exports = {
  loadConfigs,
}
