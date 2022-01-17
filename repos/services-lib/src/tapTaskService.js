const { locationsService } = require('./locationsService')
const { exists, isStr, noOpObj } = require('@keg-hub/jsutils')
const { cliStore, constants, setAppRoot } = require('@keg-hub/cli-utils')

const { DOC_ENV_CONTEXT_SRV, TAP_TASK_SRV } = constants.SERVICES

const addTaskEnvParams = (params, contextEnvs) => {
  !exists(params.imageName) &&
    isStr(contextEnvs.IMAGE) &&
    (params.imageName = contextEnvs.IMAGE)

  ;!exists(params.containerName) &&
    isStr(contextEnvs.CONTAINER_NAME) &&
    (params.containerName = contextEnvs.CONTAINER_NAME)
}

/**
 * Loads the linked taps context envs and locations into the cliStore
 * Loads linked tap context information to be used in other tasks and services
 * @function
 * @param {string} args.tap - Name of the tap to inject
 * @param {string} args.tapPath - Local path to the tap to be injected
 * @param {Object} - args.taskData used to run the task defined from the command line
 *
 * @returns {Object} - Updated taskData used to run the task defined from the command line
 */
const tapTaskService = async args => {
  const { tap, tapPath, taskData } = args

  setAppRoot(tapPath)
  const params = {
    ...taskData.params,
    tap: tap,
    context: tap,
  }

  // Get the container paths for the tap
  const locationData = await locationsService(tap, tapPath) || noOpObj
  const docEnvService = cliStore.service.get(DOC_ENV_CONTEXT_SRV)
  const contextEnvs = await docEnvService(taskData, locationData.envs)
  addTaskEnvParams(params, contextEnvs)

  const tapContext = {
    params,
    name: tap,
    tapRoot: tapPath,
    envs: contextEnvs,
    ...(locationData.locations && {locations: locationData.locations})
  }

  cliStore.context.set(`${tap}-context`, tapContext, {override: true})

  // Adds some extra params to update the tap and context params
  return {
    ...taskData,
    params
  }
}

cliStore.service.set(TAP_TASK_SRV, tapTaskService)


module.exports = {
  tapTaskService
}