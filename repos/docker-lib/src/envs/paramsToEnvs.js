const { getKegSetting } = require('@keg-hub/cli-utils')
const {
  isStr,
  isArr,
  isObj,
  exists,
  toBool,
  noOpObj,
  noPropArr,
} = require('@keg-hub/jsutils')

/**
 * Builds an envs object from a passed in param
 * Converts the envs arguments into an object based on it's type
 * @function
 * 
 * @param {Object|Array|string} envs - Envs from the command line
 * 
 * @returns {Object} - Envs converted into an object
 */
const buildEnvs = (envs=noOpObj) => {
  if(!envs || isObj(envs)) return envs

  const envArr = isArr(envs)
    ? envs
    : isStr(envs)
      ? envs.split(',')
      : noPropArr
  
  return envArr.reduce((acc, item) => {
    const [key, val] = item.split(`=`).map(part => part.trim())
    exists(key) && exists(val) && (acc[key] = val)

    return acc
  }, {})
}

/**
 * Gets the copy local flag from params || container ENVs || cli settings
 * @function
 * 
 * @param {boolean} local - Copy local flag, passed from the command line
 * @param {Object} copyLocalEnv - Copy local flag, set in the container ENVs
 * 
 * @returns {boolean}
 */
const getCopyLocal = (local, copyLocalEnv) => {
  return exists(local)
    ? toBool(local)
    : exists(copyLocalEnv)
      ? toBool(copyLocalEnv)
      : toBool(getKegSetting('docker.defaultLocalBuild'))
}

/**
 * Edge-case handling for docker build kit
 * Checks if the docker build kit envs should be set
 * @function
 * @param {boolean} buildKit - True if docker build kit envs should be set
 * 
 * @returns {Object} - Contains docker build kit envs if set
 */
const getBuildKitEnvs = buildKit => {
  const addBk = exists(buildKit) ? buildKit : getKegSetting('docker.buildKit')
  return addBk && {DOCKER_BUILDKIT: 1, COMPOSE_DOCKER_CLI_BUILD: 1}
}

const paramsAsEnvs = ({env, local, install, command}, copyLocalEnv) => {
  const paramsEnvs = {}
  env && (paramsEnvs.NODE_ENV = env)
  command && (paramsEnvs.KEG_EXEC_CMD = command)
  install && (paramsEnvs.KEG_NM_INSTALL = true)
  
  // Check if we should copy the local repo into the docker container on image build
  getCopyLocal(local, copyLocalEnv) && ( paramsEnvs.KEG_COPY_LOCAL = true )
  
  return paramsEnvs
}

/**
 * Builds the env object for the container
 * 
 * @function
 * @param {Object} params - Formatted arguments passed to the current task
 * @param {Object} copyLocalEnv - Copy local flag, set in the container ENVs
 * 
 * @returns {Object} - Converted params as an object
 */
const paramsToEnvs = (params, copyLocalEnv) => {
  return {
    // Edge-case for docker build kit
    ...getBuildKitEnvs(params.buildKit),
    ...buildEnvs(params.envs),
    ...paramsAsEnvs(params, copyLocalEnv),
  }
}

module.exports = {
  paramsToEnvs
}