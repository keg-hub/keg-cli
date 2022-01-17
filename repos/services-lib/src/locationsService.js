const path = require('path')
const { get } = require('@keg-hub/jsutils')
const { throwMissingFile } = require('./error/throwMissingFile')
const { cliStore, constants, fileSys, getTapConfig } = require('@keg-hub/cli-utils')

const { pathExists } = fileSys
const { TAP_LOCATIONS_SRV } = constants.SERVICES


/**
 * Checks if the passed in path exists on the local file system
 * @function
 * @param {string} checkPAth - Path to check if exists on the local file system
 *
 * @returns {boolean} - True if the checkPath exists on the local file system
 */
const containerPathExist = async checkPath => {
  const [ err, rep ] =  await pathExists(checkPath)
  return Boolean(rep)
}

/**
 * Checks if the mainPath exists, and if it doesn't then checks the altPAth
 * <br/>Returns either path if they exist
 * @function
 * @param {string} mainPath - Path to check if exists first
 * @param {string} altPath - Path to check if mainPath does not exist
 *
 * @returns {string} - Found path that exists from either the mainPath or altPath
 */
const checkMultiPath = async (mainPath, altPath) => {
  let hasPath = await containerPathExist(mainPath) && mainPath
  hasPath = hasPath || await containerPathExist(altPath) && altPath

  return hasPath
}

/**
 * Checks that a Dockerfile exists in the root or container path of the app
 * @function
 * @param {string} tapPath - Path to the root of the app being injected
 * @param {string} containerPath - Path to the apps container folder
 *
 * @returns {string} - Found Dockerfile path
 */
const checkDockerFile = async (tapRoot, containerPath) => {
  return await checkMultiPath(
    path.join(containerPath, 'Dockerfile'),
    path.join(tapRoot, 'Dockerfile')
  )
}

/**
 * Checks that the passed in fileName exists as a yml file
 * <br/>Checks both yml and yaml
 * @function
 * @param {string} containerPath - Path to the apps container folder
 * @param {string} fileName - Name of the yaml file to get the path for
 *
 * @returns {string} - Found yaml files path
 */
const checkYmlFile = async (containerPath, fileName) => {
  return await checkMultiPath(
    path.join(containerPath, `${ fileName }.yml`),
    path.join(containerPath, `${ fileName }.yaml`)
  )
}

/**
 * Checks that the passed in fileName exists as a .env file
 * Checks both .env and <fileName>.env
 * @function
 * @param {string} containerPath - Path to the apps container folder
 * @param {string} fileName - Name of the yaml file to get the path for
 *
 * @returns {string} - Found .env files path
 */
const checkEnvFile = async (containerPath, fileName) => {
  return await checkMultiPath(
    path.join(containerPath, `${fileName}.env`),
    path.join(containerPath, `./.env`)
  )
}


/**
 * Gets the mutagen config. If no config is found it uses the tap mutagen config
 * @function
 * @param {string} containerPath - Path to the apps container folder
 *
 * @returns {string} - Path to the mutagen config
 */
const getMutagenPath = async (containerPath, fileName) => {
  return await checkMultiPath(
    path.join(containerPath, `mutagen.yml`),
    path.join(containerPath, `${ fileName }.mutagen.yaml`)
  )
}

/**
 * Builds the default envs that define locations
 * @param {Object} locations - All found locations from the locationsService
 */
const getLocationEnvs = locations => {
  return {
    KEG_CONTEXT_PATH: locations.tapPath,
    KEG_ENVS_FILE: locations.envsPath,
    KEG_VALUES_FILE: locations.valuesPath,
    KEG_DOCKER_FILE: locations.dockerPath,
    KEG_MUTAGEN_FILE: locations.mutagenPath,
    KEG_COMPOSE_DEFAULT: locations.composePath,
    KEG_CONTAINER_PATH: locations.containerPath,
  }
}

/**
 * Checks if there is a container folder in the tap
 * Then checks if it has the correct files needed to build tap
 * If it does, then uses that container folder over the keg-cli default
 * @function
 * @param {string} tap - Name of the tap to check for files
 * @param {string} tapPath - Local path to the app to be injected
 *
 * @returns {Object} - ENVs for the context, with the KEG_CONTEXT_PATH added if needed
 */
const locationsService = async (tap, tapPath, subFolder) => {
  const tapConfig = getTapConfig({ path: tapPath})

  subFolder = subFolder || get(tapConfig, `keg.cli.paths.container`, 'container')
  const containerPath = path.join(tapPath, subFolder)

  // Check if there is a container folder at the tap path
  const hasContainer = await containerPathExist(containerPath)

  // If no container folder, just return
  if(!hasContainer) return noOpObj

  // Check if there is a Dockerfile at the tapPath or tap container folder
  const dockerPath = await checkDockerFile(tapPath, containerPath)
  !dockerPath && throwMissingFile(tap, containerPath, `Dockerfile`)

  // Check if there is a docker-compose file at in the tap container folder
  const composePath = await checkYmlFile(containerPath, 'docker-compose')
  !composePath && throwMissingFile(tap, containerPath, `docker-compose.yml`)

  // Check if there is a values file at in the tap container folder
  const valuesPath = await checkYmlFile(containerPath, 'values')
  !valuesPath && throwMissingFile(tap, containerPath, `values.yml`)

  // Get the mutagen config path, don't thrown if missing
  const mutagenPath = await getMutagenPath(containerPath)

  // Get the default envs file path don't thrown if missing
  const envsPath = await checkEnvFile(containerPath, tap)

  // Builds the locatiosn object, then the envs relative to the found locations
  const locations = {
    tapPath,
    envsPath,
    valuesPath,
    dockerPath,
    mutagenPath,
    composePath,
    containerPath,
  }

  return {
    locations,
    envs: getLocationEnvs(locations)
  }
}

cliStore.service.set(TAP_LOCATIONS_SRV, locationsService)

module.exports = {
  locationsService
}
