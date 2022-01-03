const { getKegSetting } = require('@keg-hub/cli-utils')
const { buildTapContext } = require('./buildTapContext')
const { exists, toBool, isStr } = require('@keg-hub/jsutils')
const { getPublicGitKey } = require('../git/getPublicGitKey')
const { getContainerConst } = require('../docker/getContainerConst')
const { getImgNameContext } = require('../getters/getImgNameContext')

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
 * Checks the passed in params for docker image metaData
 * Then adds it to the extraENVs object
 * @param {Object} extraENVs - Contains key/value pair of ENVs from params
 * @param {Object} params - Formatted arguments passed to the current task
 * 
 * @returns {Object} - Converted params as an object
 */
const getImageFromParam = async (extraENVs, params) => {
  const imgNameContext = await getImgNameContext(params)

  return {
    ...extraENVs,
    KEG_IMAGE_FROM: imgNameContext.full,
    KEG_IMAGE_TAG: imgNameContext.tag,
  }
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
const convertParamsToEnvs = async (params, copyLocalEnv) => {
  const { env, command, install, local, from } = params
  const extraENVs = {}

  env && ( extraENVs.NODE_ENV = env )
  command && ( extraENVs.KEG_EXEC_CMD = command )
  install && ( extraENVs.KEG_NM_INSTALL = true )

  // Check if we should copy the local repo into the docker container on image build
  getCopyLocal(local, copyLocalEnv) && ( extraENVs.KEG_COPY_LOCAL = true )

  // Check if the from param is passed in, and if so, get the image meta data from it
  return isStr(from)
    ? await getImageFromParam(extraENVs, params)
    : extraENVs

}


/**
 * Builds the ENVs for the passed in cmdContext
 * @function
 * @param {string} cmdContext - Context to run the docker container in
 * @param {Object} envs - Custom ENVs passed to the task from the cmd line
 * @param {Object} globalConfig - Global config object for the keg-cli
 * @param {string} params - Parameters passed to the task from the cmd line
 * @param {string} tap - Name of the tap to get the context ENVs for
 *
 * @returns {Object} - Flat object containing the ENVs for the cmdContext
 */
const buildContextEnvs = async (args) => {

  const { cmdContext, envs={}, globalConfig, params={}, tap } = args
  const containerEnvs = getContainerConst(cmdContext, 'env', {})
  const projectName = containerEnvs.COMPOSE_PROJECT_NAME || cmdContext
  const publicGitKey = await getPublicGitKey(globalConfig)

  // Get the ENV vars for the command context and merge with any passed in envs
  return {

    // Get the ENV context for the command
    ...containerEnvs,

    // Add the passed in custom ENVS to override any of the defaults
    ...envs,

    // Experimental docker builds. Makes docker faster and cleaner
    ...(getKegSetting('docker.buildKit') ? { DOCKER_BUILDKIT: 1, COMPOSE_DOCKER_CLI_BUILD: 1 } : {}),

    // Get the ENVs for the Tap context if it exists
    ...( tap && tap !== 'tap' && await buildTapContext({
        globalConfig,
        cmdContext,
        tap,
        envs
      })),

    // Add the git key so we can call github within the image / container
    ...(publicGitKey && { PUBLIC_GIT_KEY: publicGitKey }),

    // Get any params that should be converted into ENVs passed to docker
    ...(await convertParamsToEnvs(params, containerEnvs.KEG_COPY_LOCAL)),

    // Set the project name to allow linking services if needed
    ...(projectName && { COMPOSE_PROJECT_NAME: projectName }),
  }

}

module.exports = {
  buildContextEnvs,
  convertParamsToEnvs,
}
