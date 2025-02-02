const path = require('path')
const { loadYmlSync } = require('../yml/yml')
const { loadEnvSync } = require('../env/env')
const { getAppRoot } = require('../utils/appRoot')
const { GLOBAL_CONFIG_FOLDER } = require('../constants/constants')
const {
  get,
  isArr,
  isObj,
  exists,
  noOpObj,
  uniqArr,
  noPropArr,
  deepEqual,
  deepMerge,
} = require('@keg-hub/jsutils')


/**
 * Adds the override value to the passed in location
 * @function
 *
 * @param {string} location - Location on the local file system
 * @param {string} [override=container] - To be added to the location
 *
 * @returns {string} - Location with the override added
 */
const addContainerDir = (location, override = `container`) => {
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

  const appLocs =
    !appRoot || path.normalize(cwd) !== path.normalize(appRoot) ? [cwd] : []

  return appRoot ? [ ...appLocs, appRoot, addContainerDir(appRoot) ] : appLocs
}

/**
 * Adds a group of files to the container array if toCheck is truthy
 * @param {boolean} check - If true, files will be added to the container
 * @param {Array} container - Holds the files
 * @param {*} file - Files to add if check it true
 *
 * @returns {Void}
 */
const checkAddFile = (check, container, ...files) => {
  check && container.push(...files)
}

/**
 * Builds the yml file names in order of priority
 * @param {string} file - The reference name of the values file
 * @param {string} opts.env - The current environment
 * @param {string} opts.name - The name of the app the values file belongs to
 *
 * @return {Array} - Builtfiles names
 */
const buildYmlFiles = (file = 'values', { env, name }) => {
  const ymlFiles = []

  ymlFiles.push(`${file}.yml`)
  ymlFiles.push(`${file}.yaml`)

  checkAddFile(env, ymlFiles, `${env}.yml`, `${env}.yaml`)
  checkAddFile(name, ymlFiles, `${name}.yml`, `${name}.yaml`)

  checkAddFile(env, ymlFiles, `${file}_${env}.yml`, `${file}_${env}.yaml`)
  checkAddFile(name, ymlFiles, `${file}_${name}.yml`, `${file}_${name}.yaml`)
  checkAddFile(
    name && env,
    ymlFiles,
    `${file}_${name}_${env}.yml`,
    `${file}_${name}_${env}.yaml`,
    `${env}_${file}_${name}.yml`,
    `${env}_${file}_${name}.yaml`,
    `${name}_${env}_${file}.yml`,
    `${name}_${env}_${file}.yaml`
  )

  checkAddFile(env, ymlFiles, `${file}.${env}.yml`, `${file}.${env}.yaml`)
  checkAddFile(name, ymlFiles, `${file}.${name}.yml`, `${file}.${name}.yaml`)
  checkAddFile(
    name && env,
    ymlFiles,
    `${file}.${name}.${env}.yml`,
    `${file}.${name}.${env}.yaml`,
    `${env}.${file}.${name}.yml`,
    `${env}.${file}.${name}.yaml`,
    `${name}.${env}.${file}.yml`,
    `${name}.${env}.${file}.yaml`
  )

  checkAddFile(env, ymlFiles, `${file}-${env}.yml`, `${file}-${env}.yaml`)
  checkAddFile(name, ymlFiles, `${file}-${name}.yml`, `${file}-${name}.yaml`)
  checkAddFile(
    name && env,
    ymlFiles,
    `${file}-${name}-${env}.yml`,
    `${file}-${name}-${env}.yaml`,
    `${env}-${file}-${name}.yml`,
    `${env}-${file}-${name}.yaml`,
    `${name}-${env}-${file}.yml`,
    `${name}-${env}-${file}.yaml`
  )

  return ymlFiles
}

/**
 * Builds the env file names in order of priority
 * @param {string} opts.env - The current environment
 * @param {string} opts.name - The name of the app the values file belongs to
 *
 * @return {Array} - Built files names
 */
const buildEnvFiles = ({ env, name }) => {
  const envFiles = []

  env && envFiles.push(`.env.${env}`)
  name && envFiles.push(`.env.${name}`)
  checkAddFile(
    name && env,
    envFiles,
    `.env_${name}_${env}`,
    `.env_${env}_${name}`,
    `.env.${name}.${env}`,
    `.env.${env}.${name}`,
    `.env.${name}-${env}`,
    `.env.${env}-${name}`
  )

  env && envFiles.push(`${env}.env`)
  name && envFiles.push(`${name}.env`)
  checkAddFile(
    name && env,
    envFiles,
    `${name}_${env}.env`,
    `${env}_${name}.env`,
    `${name}.${env}.env`,
    `${env}.${name}.env`,
    `${name}-${env}.env`,
    `${env}-${name}.env`
  )

  return {
    envFiles,
    firstEnvs: [ `.env`, `defaults.env` ],
  }
}

/**
 * Builds the config file names for env and yaml files
 * @param {string} ymlName - The reference name of the values file
 * @param {string} opts.env - The current environment
 * @param {string} opts.name - The name of the app the values file belongs to
 *
 * @return {Array} - Built files names
 */
const buildFileNames = ({ ymlName, noYml, noEnv, env, name }) => {
  env = env || process.env.NODE_ENV

  const ymlFiles = noYml ? noPropArr : buildYmlFiles(ymlName, { env, name })

  const { firstEnvs, envFiles } = noEnv
    ? { firstEnvs: noPropArr, envFiles: noPropArr }
    : buildEnvFiles({ env, name })

  return {
    yml: ymlFiles,
    env: envFiles,
    first: firstEnvs,
  }
}

const loopFilesNames = (locations, defLocs, fileNames) => {
  return fileNames.reduce((acc, fileName) => {
    if (!fileName) return acc

    defLocs.map(loc => loc && acc.push(path.join(loc, fileName)))
    locations.map(loc => loc && acc.push(path.join(loc, fileName)))
    return acc
  }, [])
}

/**
 * Generates the full locations for the yml and env files to load
 * @return {Object} - Contains the yam and env file locations to load
 */
const generateLocPath = (locations, defLocs, fileNames, opts) => {
  const { noYml, noEnv } = opts
  return {
    yml: noYml ? noPropArr : uniqArr(loopFilesNames(locations, defLocs, fileNames.yml)),
    env: noEnv ? noPropArr : uniqArr(loopFilesNames(locations, defLocs, fileNames.env)),
    first: noEnv ? noPropArr : uniqArr(loopFilesNames(locations, defLocs, fileNames.first)),
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
const generateLoadPaths = ({ locations = noPropArr, ...opts }) => {
  const fileNames = buildFileNames(opts)
  const defLocs = [ ...getAppLocations(), GLOBAL_CONFIG_FOLDER ]

  return generateLocPath(locations, defLocs, fileNames, opts)
}

/**
 * Loops over each value in the merged object looking for array
 * If it finds an array, it converts it into a unique array
 * Uses deepEqual to compare values between the merged, current, and toMerge args
 */
const loopCheckArr = (merged, current, toMerge) => {
  return Object.entries(merged)
    .reduce((updated, [key, value]) => {
      const curVal = current?.[key]
      const mergeVal = toMerge?.[key]

      updated[key] = isObj(value)
        ? loopCheckArr(value, curVal, mergeVal)
        : !isArr(value) || !isArr(curVal)
          ? value
          : uniqArr(value, (item) => {
              const cItem = curVal.find(cItem => deepEqual(cItem, item))
              const mItem = cItem || mergeVal.find(mItem => deepEqual(mItem, item))
              return mItem || item
            })

      return updated
    }, isArr(merged) ? [] : {})
}

/**
 * Checks the array merge strategy, defaults to join
 * If join then deep merge and return
 */
const mergeObjs = (current, toMerge, opts) => {
  const { mergeStrategy=`overwrite` } = opts
  if(mergeStrategy !== `join` && mergeStrategy !== `unique`)
    return {...current, ...toMerge}

  const merged = deepMerge(current, toMerge)
  return mergeStrategy === `join`
    ? merged
    : loopCheckArr(merged, current, toMerge)
}

/**
 * Loads yml and env configs
 * First generates all possible locations
 * Then based on the extension type, loads it's content
 * @param {Object} config - Settings for loading the config files
 * @param {string} config.env - The current environment
 * @param {boolean} [config.error=true] - Should errors be thrown
 * @param {RegEx} config.pattern - Pattern to match against template values
 * @param {Array} config.locations - Path to folder that should be searched
 * @param {boolean} config.fill - Should the content be treated as a template
 * @param {boolean} [config.noEnv=false] - If true env files will not be loaded
 * @param {boolean} [config.noYml=false] - If true yml files will not be loaded
 * @param {string} config.name - The name of the app the values file belongs to
 * @param {string} config.data - Data to fill the config files if they are templates
 * @param {string} config.format - Type that should be returned (string || Object)
 * @param {string} [config.ymlName='values'] - The reference name of the values file
 * @param {Array<string>|string} [config.ymlPath='env'] - Path to the env that exist on the yml object
 *
 * @return {Object} - Loaded config file ENVs
 */
const loadConfigs = (config = noOpObj) => {
  const { noYml, noEnv } = config
  const loadFrom = generateLoadPaths(config)

  // Load the env files, and merge with the yml files
  const firstEnvs = noEnv
    ? noOpObj
    : loadFrom.first.reduce((acc, location) => {
      return {
        ...acc,
        ...loadEnvSync({ error: false, ...config, location }),
      }
    }, noOpObj)

  const ymlPath = exists(config.ymlPath) ? config.ymlPath : 'env'

  // Load the yml files
  const ymlValues = noYml
    ? noOpObj
    : loadFrom.yml.reduce((acc, location) => {
      const content = loadYmlSync({ error: false, ...config, location })
      const toMerge = ymlPath ? get(content, ymlPath) : content

      return mergeObjs(acc, toMerge, config)
    }, firstEnvs)

  // Load the env files, and merge with the yml files
  return noEnv
    ? ymlValues
    : loadFrom.env.reduce((acc, location) => {
      return {
        ...acc,
        ...loadEnvSync({ error: false, ...config, location }),
      }
    }, ymlValues)
}

module.exports = {
  loadConfigs,
}
