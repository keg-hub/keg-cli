const { cliStore, constants } = require('@keg-hub/cli-utils')
const { locationsService } = require('./locationsService')
const { DOC_ENV_CONTEXT_SRV, TAP_TASK_SRV } = constants.SERVICES

/**
 * Injects the passed in tap params into the DOCKER constants
 * <br/>This allows linked tap to define their own container folders outside of the Keg-Cli
 * @function
 * @param {string} args.tap - Name of the tap to inject
 * @param {string} args.tapPath - Local path to the tap to be injected
 * @param {Object} - args.taskData used to run the task defined from the command line
 *
 * @returns {Object} - Updated taskData used to run the task defined from the command line
 */
const tapTaskService = async args => {
  const { tap, tapPath, taskData } = args
  const tapContext = {name: tap, tapRoot: tapPath}

  // Get the container paths for the tap
  const locationData = await locationsService(tap, tapPath)

  // If no container paths just return
  // This will use the default tap container
  if(locationData && locationData.locations){
    const docEnvService = cliStore.service.get(DOC_ENV_CONTEXT_SRV)
    const contextEnvs = await docEnvService(taskData, locationData)
    tapContext.envs = contextEnvs
    tapContext.locations = locationData.locations
  }

  cliStore.context.set(`${tap}-context`, tapContext, {override: true})
  // Adds some extra params to update the tap and context params
  return {
    ...taskData,
    params: {
      // Params passed from the command line should always override injected params
      ...taskData.params,
      tap: tap,
      context: tap,
    }
  }
}

cliStore.service.set(TAP_TASK_SRV, tapTaskService)


module.exports = {
  tapTaskService
}