const { exists, get, noOpObj } = require('@keg-hub/jsutils')
const {
  getContextEnv,
  checkImageExists,
  getImgNameContext,
} = require('@keg-hub/docker-lib')
const {
  Logger,
  cliStore,
  constants,
  getKegSetting,
  runInternalTask,
} = require('@keg-hub/cli-utils')

const { TAP_PULL_SRV } = constants.SERVICES

/**
 * Checks if new Docker images should be pulled when a docker command is run
 * @function
 * @param {string} params.context - Context or name of the container to check
 * @param {string} params.image - Name of image to check for
 * @param {string} params.tag - Tag of image to check for
 * @param {string} params.pull - Should the image should be pulled (skipped is property undefined)
 *
 * @returns {boolean} - Should the docker image be pulled
 */
const shouldPullImage = (params=noOpObj, contextData=noOpObj) => {

  const pull = getKegSetting('docker.imagePullPolicy') || ''
  const pullPolicy = getContextEnv(
    contextData.name,
    'KEG_IMAGE_PULL_POLICY',
    pull
  ).toLowerCase()

  // If should never pull image and the image exists return false
  // Else check if the set to ifnotpresent and return if the image exists
  // Else return true
  return pullPolicy === 'never'
    ? false
    : pullPolicy === 'ifnotpresent'
      ? checkImageExists(params, contextData)
      : true
}


/**
 * Checks if the base image should be pulled
 * @function
 * @param {Object} args - Parsed option arguments passed to the current task
 * @param {boolean} args.pull - Should the image should be pulled (skipped is property undefined)
 * @param {Object} args.force - Override default setting 
 * @param {boolean} internalForce - Internal Keg-CLI argument to force pulling the image
 * @param {boolean} paramForce - Force pull from params
 *
 * @returns {boolean} - Should the keg-base image be pulled
 */
const checkPullImage = async ({ force, pull, ...params }, contextData) => {
  return exists(pull)
    ? pull
    : exists(force)
      ? force
        : exists(contextData.pull)
          ? contextData.pull
          : shouldPullImage(params, contextData)
}

/**
 * Checks the if a new base image should be pulled, and pulls it if needed
 * @param {Object} args - Parsed option arguments passed to the current task
 *
 * @returns {Object} - docker pull task response. (Sets `isNewImage` property if a new image was pulled)
 */
const pullService = async (args, contextData, pullTask='docker') => {
  contextData = contextData || getServiceContext(args)

  // Check if the image should be pulled
  const shouldPull = get(args, '__internal.forcePull') ||
    await checkPullImage(
      args.params,
      contextData,
    )

  const imgNameContext = await getImgNameContext(args.params)
  if(!shouldPull) return { imgNameContext, isNewImage: false }

  try {
    // Check and pull the image if needed
    return pullTask !== 'docker'
      ? await runInternalTask('docker.tasks.compose.tasks.pull', args)
      : await runInternalTask('docker.tasks.provider.tasks.pull', args)
  }
  catch(err){
    // TODO: Check the error type
    // If the error is due to something other then a time out we want to throw
    err.message && Logger.warn(err.message)
    return { imgNameContext, isNewImage: false }
  }

}

cliStore.service.set(TAP_PULL_SRV, pullService)

module.exports = {
  pullService
}